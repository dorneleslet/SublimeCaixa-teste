from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from datetime import datetime
from .models import Cliente, FichaCliente
import re
from django.core import serializers
import json
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse
from django.shortcuts import redirect, get_object_or_404, render
from django.db.models import Q
from django.utils import timezone
from django.template.loader import render_to_string
from accounts.decorators import grupo_required


def dados_cliente(request, id): 
    cliente = Cliente.objects.get(id=id)
    dados = {
        'id': cliente.id,
        'nome': cliente.nome,
        'telefone': cliente.telefone,
        'nascimento': cliente.nascimento.strftime('%d/%m/%Y') if cliente.nascimento else '',
        'email': cliente.email,
        'nif': cliente.nif,
    }
    return JsonResponse(dados)



def clientes(request): # lista todos os clientes ou cadastra um novo
    if request.method == "GET":
        cliente_list = Cliente.objects.all().order_by('nome').filter(ativo=True).values() #coloca a lista em ordem a-z
        return render(request, 'clientes.html',  {'clientes': cliente_list})
    elif request.method == "POST":
        nome = request.POST.get('nome') #vai capturar um dado do metodo post
        telefone = request.POST.get('telefone')
        nascimento = request.POST.get('nascimento') #Primeiro pega a string
        # if nascimento == "":
        #     nascimento = None # ou deixe nulo para salvar corretamente 
        email = request.POST.get('email') or None
        nif = request.POST.get('nif', '').strip()

        contexto = {
            'nome': nome,
            'telefone': telefone,
            'nif': nif,
            'nascimento': nascimento,
            'email': email if email else '',
            'clientes': Cliente.objects.all().order_by('nome').filter(ativo=True).values()
        }

        # Verifica os campos obrigatórios
        if not nome:
            contexto['erro_nome'] = 'Por favor, indique o nome do cliente.'

        if not telefone or not telefone.startswith("+") or not telefone[1:].isdigit() or len(telefone) < 10 or len(telefone) > 15:
            contexto['erro_telefone'] = 'Por favor, indique um número para contato.'
            
           
        # if not nif:
        #     contexto['erro_nif'] = 'Por favor, indique o número de contribuinte.'
        # elif len(nif) != 9 or not nif.isdigit():
        #     contexto['erro_nif'] = 'O NIF deve conter exatamente 9 dígitos numéricos.'

        if nascimento:
            try:
                nascimento = datetime.strptime(nascimento, '%d/%m/%Y').date()
                if nascimento.year > datetime.now().year:
                    contexto['erro_nascimento'] = f'O ano de nascimento não pode ser maior que {datetime.now().year}.'
                    return render(request, 'clientes.html', contexto)
            except ValueError:
                contexto['erro_nascimento'] = 'Data inválida. Use o formato DD/MM/AAAA.'
                return render(request, 'clientes.html', contexto)
        else:
            nascimento = None    

        if 'erro_nome' in contexto or 'erro_telefone' in contexto or 'erro_nascimento' in contexto: #'erro_nif' in contexto or 
            return render(request, 'clientes.html', contexto)
        
        

    
        # Verifica se o cliente já existe
        cliente = Cliente.objects.filter(nif=nif)
        if cliente.exists():
            contexto['erro_nif'] = 'Cliente com este NIF já existe.'
            return render(request, 'clientes.html', contexto)
        
        # Verifica e-mail, se informado
        if email:
            padrao_email = re.compile(r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+')
            if not re.fullmatch(padrao_email, email):
                contexto['erro_email'] = 'E-mail inválido.'


        cliente = Cliente(
            nome = nome,
            telefone = telefone,
            nif = nif,
            nascimento = nascimento if nascimento else None,
            email = email if email else None,
            
        )

        cliente.save()

        return render(request, 'clientes.html', {
            'mensagem_sucesso':True,
            'clientes': Cliente.objects.all().order_by('nome').filter(ativo=True).values()
        })
        
def att_cliente(request): #onde seleciona o id para ser atualizado
    if request.method == "POST":
        id_cliente = request.POST.get('id_cliente')

        cliente = Cliente.objects.filter(id=id_cliente) #busca no banco

        cliente_json = json.loads(serializers.serialize('json', cliente))[0]['fields']
        cliente_id = json.loads(serializers.serialize('json', cliente))[0]['pk'] 
       
        data = {'cliente': cliente_json, 'cliente_id': cliente_id}
        return JsonResponse({'cliente_id': id_cliente, **cliente_json})


    

def update_cliente(request, id): #atualiza dados via json
    body = json.loads(request.body)
    
    nome = body['nome']
    telefone = body['telefone']
    nascimento_str = body.get('nascimento')
    email = body['email']
    nif = body['nif']

    erros = {}
    nascimento = None
    if not nome:
        erros['erro_edit-nome'] = 'Por favor, indique o nome do cliente.'
    if not telefone:
        erros['erro_edit-telefone'] = 'Por favor, indique um número para contato.'
    if not nif:
        erros['erro_edit-nif'] = 'Por favor, indique o número de contribuinte.'
    if nascimento_str:
        try:
            nascimento = datetime.strptime(nascimento_str, '%d/%m/%Y').date()
            if nascimento.year > datetime.now().year:
                erros['erro_edit-nascimento'] = f'O ano de nascimento não pode ser maior que {datetime.now().year}.'
        except ValueError:
            erros['erro_edit-nascimento'] = 'Data inválida. Use o formato DD/MM/AAAA.'  

    if erros: 
        return JsonResponse({'status': 'erro', 'erros': erros})  
    
    # Verifica se já existe outro cliente com o mesmo NIF
    cliente_existente = Cliente.objects.filter(nif=nif).exclude(id=id).first()
    if cliente_existente:
        erros['erro_edit-nif'] = 'Já existe um cliente com este NIF.'
    if erros:
        return JsonResponse({'status': 'erro', 'erros': erros})

    cliente = get_object_or_404(Cliente, id=id)
    import traceback
    try:
        # Atualiza o cliente se não tiver erro
        cliente.nome = nome
        cliente.telefone = telefone
        cliente.nascimento = nascimento
        cliente.email = email    
        cliente.nif = nif
        cliente.save()

        return JsonResponse({'status': '200',
                              'nome': nome,
                              'telefone': telefone,
                              'nascimento': nascimento,
                              'email': email,
                              'nif': nif
        })
    except Exception as e:
        print('Erro ao atualizar cliente:', e)
        traceback.print_exc()
        return JsonResponse({'status': '500'})

def buscar_clientes(request):
    q = request.GET.get('q', '')
    clientes = Cliente.objects.filter(
        Q(nome__icontains=q) | Q(telefone__icontains=q) | Q(nif__icontains=q)
    ).filter(ativo=True).values('id', 'nome', 'telefone', 'nif')[:10]

    return JsonResponse({'clientes': list(clientes)})

def listar_todos_clientes(request):
    clientes = Cliente.objects.all().order_by('nome').filter(ativo=True).values('id', 'nome', 'telefone', 'nif')
    clientes_lista = list(clientes)
    return JsonResponse(clientes_lista, safe=False)

def adicionar_ficha(request, cliente_id): #salva ficha e retorna json
    cliente = get_object_or_404(Cliente, id=cliente_id)

    if request.method == 'POST':
        data_str = request.POST.get('data')
        profissional = request.POST.get('profissional')
        valor = request.POST.get('valor')
        procedimento = request.POST.get('procedimento')
        homecare = request.POST.get('homecare')
        observacao = request.POST.get('observacao')

        # converter data para datetime (dd/mm/yyyy)
        try:
            data_formatada = datetime.strptime(data_str, '%d/%m/%Y')
            if timezone.is_naive(data_formatada):
                data_formatada = timezone.make_aware(data_formatada)
        except (ValueError, TypeError):
            data_formatada = datetime.now() #fallback caso usuário insira errado

        if data_str and valor: # obrigatórios
            ficha = FichaCliente.objects.create(
                cliente=cliente,
                data=data_formatada,
                profissional=profissional,
                valor=float(valor.replace('.', '').replace(',', '.')), # remove ponto de milhar e troca virgula por ponto
                procedimento=procedimento,
                homecare=homecare,
                observacao=observacao,
            )

            html_ficha = render_to_string('clientes/fichacliente.html', {'ficha': ficha})
            return JsonResponse({'status': 'ok', 'html_ficha': html_ficha})
        
def detalhe_cliente(request, cliente_id): #mostrar as fichas no histórico
    cliente = get_object_or_404(Cliente, id=cliente_id)
    fichas = cliente.fichas.order_by('-data')

    return render(request, 'clientes/fichashistorico.html', {'fichas': fichas})

def ocultar_cliente(request, cliente_id):
    if request.method == 'POST':
        try:
            cliente = Cliente.objects.get(pk=cliente_id)
            cliente.ativo = False
            cliente.save()
            return JsonResponse({'success': True})
        except Cliente.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Cliente não encontrado'})
    return JsonResponse({'success': False, 'error': 'Método não permitido'})

def excluir_ficha(request, ficha_id):
    ficha = get_object_or_404(FichaCliente, id=ficha_id)

    if request.method == 'POST':
        ficha.delete()
        return JsonResponse({'status': 'ok', 'ficha_id': ficha_id})
    else:
        return JsonResponse({'status': 'erro', 'mensagem': 'Método inválido'})

def ficha_detalhes(request, ficha_id):
    try:
        ficha = get_object_or_404(FichaCliente, id=ficha_id)
        dados = {
            'id': ficha.id,
            'data': ficha.data.strftime('%d/%m/%Y'),
            'profissional': ficha.profissional or "",
            'valor': f"{ficha.valor:.2f}",
            'procedimento': ficha.procedimento or "",
            'homecare': ficha.homecare or "",
            'observacao': ficha.observacao or "",
        }
        return JsonResponse({'status': 'ok', 'ficha': dados})
    except FichaCliente.DoesNotExist:
        return JsonResponse({'status': 'erro', 'mensagem': 'Ficha não encontrada'}, status=404)


@csrf_exempt
def update_ficha(request, ficha_id):
    if request.method == 'POST':
        try:
            ficha = get_object_or_404(FichaCliente, id=ficha_id)
            data = json.loads(request.body)

            data_str = data.get('data')
            valor_str = str(data.get('valor', '0')).replace('.', '').replace(',', '.').strip()

            if not data_str or not valor_str:
                return JsonResponse({'status': 'erro', 'mensagem': 'Data e valor são obrigatórios.'}, status=400)

            try:
                data_formatada = datetime.strptime(data_str, '%d/%m/%Y')
                if timezone.is_naive(data_formatada):
                    ficha.data = timezone.make_aware(data_formatada)
                else:
                    ficha.data = data_formatada
            except (ValueError, TypeError):
                return JsonResponse({'status': 'erro', 'mensagem': 'Formato de data inválido. Use DD/MM/AAAA.'}, status=400)
            
            try:
                ficha.valor = float(valor_str)
            except (ValueError, TypeError):
                return JsonResponse({'status': 'erro', 'mensagem': 'Formato de valor inválido.'}, status=400)

            ficha.profissional = data.get('profissional', '')
            ficha.procedimento = data.get('procedimento', '')
            ficha.homecare = data.get('homecare', '')
            ficha.observacao = data.get('observacao', '')
            
            ficha.save()

            return JsonResponse({'status': 'ok'})
        except Exception as e:
            return JsonResponse({'status': 'erro', 'mensagem': str(e)}, status=500)
    return JsonResponse({'status': 'erro', 'mensagem': 'Método não permitido'}, status=405)