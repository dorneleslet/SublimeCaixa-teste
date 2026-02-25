from django.http import JsonResponse
from .models import ProdutoEstoque

def listar_estoque_api(request):
    produtos = ProdutoEstoque.objects.all()
    
    lista = []

    for produto in produtos:
        lista.append({
            "id": produto.id,
            "nome": produto.nome,
            "quantidade": produto.quantidade,
            "preco_unitario": produto.preco_unitario,
        })
    return JsonResponse(lista, safe=False)

def dados_produto_api(request, id):
    try:
        produto = ProdutoEstoque.objects.get(id=id)

        dados = {
            'id': produto.id,
            'nome': produto.nome,
            'quantidade': produto.quantidade,
            'preco_unitario': produto.preco_unitario,
            'descricao': produto.descricao,
        }
        return JsonResponse(dados)
    except ProdutoEstoque.DoesNotExist:
        return JsonResponse(
            {'erro': 'Produto não encontrado'},
            status=404
        )