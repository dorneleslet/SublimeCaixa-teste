from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from clientes.models import Cliente, FichaCliente
from servicos.models import Servico
from estoque.models import ProdutoEstoque, MovimentacaoEstoque
from .models import Venda, VendaItem
from decimal import Decimal
from django.db.models import Q
import json
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from accounts.decorators import grupo_required 



def caixa_principal(request):
    clientes = Cliente.objects.all().order_by('nome')
    servicos = Servico.objects.all().order_by('nome')
    produtos = ProdutoEstoque.objects.all().order_by('nome')

    return render(request, 'caixa.html', {
        'clientes': clientes,
        'servicos': servicos,
        'produtos': produtos,
    })

def finalizar_venda(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            #venda = None

            cliente_id = data.get('cliente')
            total = data.get('total')
            forma_pagamento = data.get('forma_pagamento')
            desconto = float(data.get('desconto', 0))
            sinal = float(data.get('sinal', 0))
            produto_id = data.get('produto', []) #ids dos produtos
            servico_id = data.get('servico', [])

            

            # se o total vier como string, garante que vira número
            try:
                total = float(total)
            except:
                total = 0

            with transaction.atomic(): # garante que a venda é gravada por completo ou nada é gravado
                cliente = None
                if cliente_id:
                    try:
                        cliente = Cliente.objects.get(id=cliente_id)
                    except Cliente.DoesNotExist:
                        cliente = None
                
                # cria a venda
                venda = Venda.objects.create(
                    cliente=cliente,
                    total=total,
                    forma_pagamento=forma_pagamento,
                    desconto=desconto,
                    sinal=sinal,
                    fatura=data.get('fatura', 'nao'),
                    profissional=data.get('profissional', ''),
                    observacoes=data.get('observacoes', ''),
                )

                if produto_id:
                    for item in produto_id:
                        pid = int(item['id'])
                        quantidade = item.get('quantidade', 1)

                        produto = get_object_or_404(ProdutoEstoque, id=pid)

                        #impede venda se o estoque for 0 ou menor
                        if produto.quantidade <= 0:
                                return JsonResponse({'success': False, 'error': f'{produto.nome} sem estoque'})
                        
                        if quantidade > produto.quantidade:
                                return JsonResponse({'success': False, 'error': f'Estoque insuficiente para {produto.nome}. Disponível: {produto.quantidade}'})

                        VendaItem.objects.create(
                            venda=venda,
                            produto=produto,
                            nome_produto=produto.nome, #congela o nome no recibo
                            quantidade=quantidade,
                            valor_unitario=produto.preco_unitario, #congela o preço no recibo
                        )

                        MovimentacaoEstoque.objects.create(
                            produto=produto,
                            cliente=cliente,
                            tipo=MovimentacaoEstoque.SAIDA,
                            quantidade=quantidade
                        )
                if servico_id:
                    for item in servico_id:
                        sid = int(item['id'])
                        quantidade = item.get('quantidade', 1)

                        servico = get_object_or_404(Servico, id=sid)

                        VendaItem.objects.create(
                            venda=venda,
                            servico=servico,
                            nome_servico=servico.nome, #congela o nome no recibo
                            quantidade=quantidade,
                            valor_unitario=servico.preco, #congela o preço no recibo
                        )

            return JsonResponse({'success': True, 'venda_id': venda.id})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Método não permitido'})


def buscar_clientes(request):
    q = request.GET.get('q', '').strip()
    clientes = Cliente.objects.filter(
        Q(nome__icontains=q) |
        Q(telefone__icontains=q) |
        Q(nif__icontains=q), ativo=True
        ).values('id', 'nome', 'telefone', 'nif', 'email', 'nascimento')
    return JsonResponse(list(clientes), safe=False)

def detalhes_cliente(request, cliente_id):
    cliente = Cliente.objects.filter(id=cliente_id, ativo=True).values(
        'telefone', 'nif', 'email', 'nascimento'
    ).first()

    if cliente is None:
        return JsonResponse({'erro': 'Cliente não encontrado'}, status=404)
    return JsonResponse(cliente)

def buscar_servico(request):
    termo = request.GET.get('q', '')
    servicos = Servico.objects.filter(
        nome__icontains=termo
    ).values('id', 'nome', 'preco')

    return JsonResponse(list(servicos), safe=False)

def buscar_produto(request):
    q = request.GET.get('q', '')
    produtos = ProdutoEstoque.objects.filter(nome__icontains=q)
    results = [{'id': p.id, 'nome': p.nome, 'preco': str(p.preco_unitario), 'quantidade': p.quantidade} for p in produtos]

    return JsonResponse(results, safe=False)

def historico_vendas(request):
     vendas = Venda.objects.select_related('cliente').order_by('-data') # mais recente pra mais antiga
     return render(request, 'caixa/historico_vendas.html', {'vendas': vendas})

def relatorio_venda(request, venda_id):
    venda = get_object_or_404(Venda, id=venda_id)
    itens = venda.itens.all()
    return render(request, 'caixa/relatorio_venda_detalhe.html', {
        'venda': venda,
        'itens': itens,
    })

def adicionar_ficha(request,cliente_id):
    if request.method == 'POST':
        cliente = get_object_or_404(Cliente, id=cliente_id)

        ficha = FichaCliente.objects.create(
            cliente=cliente,
            data=request.POST.get('data'),
            profissional=request.POST.get('profissional'),
            valor=request.POST.get('valor'),
            procedimento=request.POST.get('procedimento'),
            homecare=request.POST.get('homecare'),
            observacao=request.POST.get('observacao'),
        )

        # renderiza um pedacinho de HTML com a ficha salva
        html_ficha = render(
            request,
            'clientes/fichacliente.html',
            {'ficha': ficha}
        ).content.decode('utf-8')

        return JsonResponse({'status': 'ok', 'html_ficha': html_ficha})
    return JsonResponse({'status': 'erro', 'msg': 'Método inválido.'})