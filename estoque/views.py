from django.shortcuts import render, redirect, get_object_or_404
from .models import ProdutoEstoque, MovimentacaoEstoque
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib import messages
from django.db.models import Sum, Q, F
from django.utils.dateparse import parse_date
from clientes.models import Cliente
from decimal import Decimal, InvalidOperation
from django.db.models.functions import TruncDate
import time



def listar_estoque(request):
    # produtos = ProdutoEstoque.objects.all().order_by('nome') #produtos em ordem alfabética
    # return render(request, 'estoque.html', {'produtos': produtos})
    return render(request, 'estoque.html')

def novo_produto(request):
    if request.method == 'POST':
        nome = request.POST.get('nome')
        quantidade = int(request.POST.get('quantidade', 0))
        preco_unitario = request.POST.get('preco_unitario')
        descricao = request.POST.get('descricao')

        preco_unitario = preco_unitario.replace(',','.')
             

        produto = ProdutoEstoque.objects.create(
            nome=nome,
            preco_unitario=preco_unitario,
            descricao=descricao,
        )

        if quantidade > 0:
            MovimentacaoEstoque.objects.create(
                produto=produto,
                tipo=MovimentacaoEstoque.ENTRADA,
                quantidade=quantidade,
            )

        messages.success(request, 'Produto cadastrado com sucesso!')
        return redirect('listar_estoque')
    return render(request, 'estoque.html')

def get_produto(request, id):
    produto = ProdutoEstoque.objects.get(id=id)
    return JsonResponse({
        'nome': produto.nome,
        'quantidade': produto.quantidade,
        'preco_unitario': produto.preco_unitario,
        'descricao': produto.descricao,
    })


def editar_produto(request, id):
    if request.method == 'POST':
        try:

            produto = get_object_or_404(ProdutoEstoque, id=id)
            produto.nome = request.POST.get('nome')
            produto.preco_unitario = request.POST.get('preco_unitario')
            produto.descricao = request.POST.get('descricao')
            produto.save()
            #adiciona nova entrada no estoque 
            try:
                nova_entrada = int(request.POST.get('nova_entrada') or 0)
            except ValueError:
                nova_entrada = 0
            if nova_entrada > 0:
                MovimentacaoEstoque.objects.create(
                    produto=produto,
                    tipo=MovimentacaoEstoque.ENTRADA,
                    quantidade=nova_entrada,
                )
            
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Método não permitido'}, status=405)

@csrf_exempt
def excluir_produto(request, id):
    if request.method == 'POST':
        try:
            produto = get_object_or_404(ProdutoEstoque, id=id)
            produto.delete()
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse ({'status': 'error', 'message': str(e)}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Método não permitido'}, status=405)


def lista_produtos(request):
    produtos = ProdutoEstoque.objects.all()
    produtos_lista = [ # converter queryset para lista
        {
            'id': p.id,
            'nome': p.nome,
            'quantidade': p.quantidade,
            'preco_unitario': float(p.preco_unitario),
            'descricao': p.descricao or '',

        }
        for p in produtos
    ]
    return JsonResponse(produtos_lista, safe=False)

def entrada_estoque(request, produto_id):
    produto = get_object_or_404(ProdutoEstoque, id=produto_id)
    quantidade = int(request.POST.get('quantidade', 0))

    if quantidade > 0:
        MovimentacaoEstoque.objects.create(
            produto=produto,
            tipo=MovimentacaoEstoque.ENTRADA,
            quantidade=quantidade,
        )
    return redirect('listar_estoque')

def saida_estoque(request, produto_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        quantidade = int(request.POST.get('quantidade', 0))
        cliente_id = data.get('cliente')
    else:
        return JsonResponse({'status': 'error', 'message': 'Método inválido'}, status=405)

    produto = get_object_or_404(ProdutoEstoque, id=produto_id)

    if quantidade <= 0:
        return JsonResponse({'status': 'error', 'message': 'Quantidade inválida'}, status=400)
    
    if produto.quantidade < quantidade:
        return JsonResponse({'status': 'error', 'message': 'Estoque insuficiente'}, status=400)
    
    cliente = None
    if cliente_id:
        cliente = Cliente.objects.filter(id=cliente_id).first()

    MovimentacaoEstoque.objects.create(
        produto=produto,
        cliente=cliente,
        tipo=MovimentacaoEstoque.SAIDA,
        quantidade=quantidade,
    )
    return JsonResponse({'status': 'success', 'editar_quantidade': produto.quantidade})


def relatorio_estoque(request):
    data_inicio = request.GET.get('data_inicio')
    data_fim = request.GET.get('data_fim')
    cliente_id = request.GET.get('cliente')
    search = request.GET.get('search')

    #converte datas
    inicio = parse_date(data_inicio) if data_inicio else None
    fim = parse_date(data_fim) if data_fim else None

    # Resumo do relatório
    produtos = ProdutoEstoque.objects.all()

    resumo_estoque = []
    for produto in produtos:
        movimentacoes = produto.movimentacoes.all()
        #entradas = produto.movimentacoes.filter(tipo='entrada').aggregate(total=Sum('quantidade'))['total'] or 0
        #saidas = produto.movimentacoes.filter(tipo='saida').aggregate(total=Sum('quantidade'))['total'] or 0
        #saldo = produto.quantidade #campo onde guarda o estoque atual
        # aplica filtro de data
        if inicio:
            movimentacoes = movimentacoes.filter(data__date__gte=inicio)
        if fim:
            movimentacoes = movimentacoes.filter(data__date__lte=fim)

        entradas = movimentacoes.filter(tipo='entrada').aggregate(total=Sum('quantidade'))['total'] or 0
        saidas = movimentacoes.filter(tipo='saida').aggregate(total=Sum('quantidade'))['total'] or 0
        saldo = produto.quantidade #campo onde guarda o estoque atual

        resumo_estoque.append({
            'produto': produto,
            'entradas': entradas,
            'saidas': saidas,
            'saldo': saldo, 
        })

    resumo_estoque = sorted(resumo_estoque, key=lambda item: item['produto'].nome.lower())

    # Histórico de entradas
    historico = MovimentacaoEstoque.objects.select_related('cliente', 'produto').annotate(
        data_dia=TruncDate('data')
    )
    #historico_entradas = MovimentacaoEstoque.objects.select_related('produto').filter(tipo='entrada').order_by('-data')
    #historico_saida = MovimentacaoEstoque.objects.select_related('produto').filter(tipo='saida').order_by('-data')

    

    if inicio:
        historico = historico.filter(data_dia__gte=inicio)
    if fim:
        historico = historico.filter(data_dia__lte=fim)
    if cliente_id:
        historico = historico.filter(cliente_id=cliente_id)
    if search:
        historico = historico.filter(cliente__nome__icontains=search)

    historico = historico.order_by('-data_dia', '-data')
    context = {
        'resumo_estoque': resumo_estoque,
        'historico': historico,
        'search': search,
    }

    return render(request, 'estoque/relatorio.html', context)