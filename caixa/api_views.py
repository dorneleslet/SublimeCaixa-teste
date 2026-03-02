from django.http import JsonResponse
from .models import Venda, VendaItem, Cliente, ProdutoEstoque, Servico
from estoque.models import MovimentacaoEstoque
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.shortcuts import get_object_or_404
import json
from decimal import Decimal

def listar_vendas_api(request):
    vendas = Venda.objects.select_related('cliente').order_by('-data')  # mais recente pra mais antiga  
    return JsonResponse(list(vendas.values()), safe=False)

def relatorio_venda_api(request, id):
    try:
        venda = Venda.objects.get(id=id)
        itens = venda.itens.all()
        return JsonResponse(list(itens.values()), safe=False)
    except Venda.DoesNotExist:
        return JsonResponse(
            {'erro': 'Venda não encontrada'},
            status=404
        )
    
@csrf_exempt
def criar_venda_api(request):
    if request.method != "POST":
        return JsonResponse(
            {"erro": "Método não permitido"},
            status=405
        )

    try:
        data = json.loads(request.body)

        cliente_id = data.get('cliente')
        total = Decimal(str(data.get('total', 0)))
        forma_pagamento = data.get('forma_pagamento')
        desconto = Decimal(str(data.get('desconto', 0)))
        sinal = Decimal(str(data.get('sinal', 0)))
        produtos = data.get('produto', [])
        servicos = data.get('servico', [])

        if not forma_pagamento:
            return JsonResponse(
                {"erro": "Forma de pagamento é obrigatória"},
                status=400
            )

        with transaction.atomic():

            cliente = None
            if cliente_id:
                cliente = Cliente.objects.filter(id=cliente_id).first()

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

            # Produtos
            for item in produtos:
                produto = get_object_or_404(ProdutoEstoque, id=item['id'])
                quantidade = int(item.get('quantidade', 1))

                if produto.quantidade <= 0:
                    return JsonResponse(
                        {"erro": f"{produto.nome} sem estoque"},
                        status=400
                    )

                if quantidade > produto.quantidade:
                    return JsonResponse(
                        {"erro": f"Estoque insuficiente para {produto.nome}"},
                        status=400
                    )

                VendaItem.objects.create(
                    venda=venda,
                    produto=produto,
                    nome_produto=produto.nome,
                    quantidade=quantidade,
                    valor_unitario=produto.preco_unitario,
                )

                MovimentacaoEstoque.objects.create(
                    produto=produto,
                    cliente=cliente,
                    tipo=MovimentacaoEstoque.SAIDA,
                    quantidade=quantidade
                )

            # Serviços
            for item in servicos:
                servico = get_object_or_404(Servico, id=item['id'])
                quantidade = int(item.get('quantidade', 1))

                VendaItem.objects.create(
                    venda=venda,
                    servico=servico,
                    nome_servico=servico.nome,
                    quantidade=quantidade,
                    valor_unitario=servico.preco,
                )

        return JsonResponse({
            "id": venda.id,
            "cliente_id": cliente_id,
            "total": str(venda.total),
            "forma_pagamento": venda.forma_pagamento,
            "status": "criada"
        }, status=201)

    except Exception as e:
        return JsonResponse(
            {"erro": str(e)},
            status=500
        )