from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from .models import ProdutoEstoque, MovimentacaoEstoque


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
    
@csrf_exempt
def criar_produto_api(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            nome = data.get("nome")
            quantidade = int(data.get("quantidade", 0))
            preco_unitario = str(data.get("preco_unitario")).replace(",", ".")
            descricao = data.get("descricao")

            if not nome:
                return JsonResponse({"erro": "Nome é obrigatório"}, status=400)

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

            return JsonResponse({
                "id": produto.id,
                "nome": produto.nome,
                "quantidade": produto.quantidade,
                "preco_unitario": str(produto.preco_unitario),
                "descricao": produto.descricao,
            }, status=201)

        except Exception as e:
            return JsonResponse({"erro": str(e)}, status=500)

    return JsonResponse({"erro": "Método não permitido"}, status=405)