from django.http import JsonResponse
from .models import Servico
from django.views.decorators.csrf import csrf_exempt
import json
from decimal import Decimal, InvalidOperation


def listar_servicos_api(request):
    servicos = Servico.objects.all().order_by('nome').values('id', 'nome', 'preco')
    return JsonResponse(list(servicos), safe=False)

def dados_servico_api(request, id):
    try:
        servico = Servico.objects.get(id=id)
        dados = {
            'id': servico.id,
            'nome': servico.nome,
            'preco': servico.preco,
        }
        return JsonResponse(dados)
    except Servico.DoesNotExist:
        return JsonResponse(
            {'erro': 'Serviço não encontrado'},
            status=404
        )   
    
@csrf_exempt
def criar_servico_api(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            nome = data.get("nome", "").strip()
            preco_str = str(data.get("preco", "")).replace('.', '').replace(',', '.')

            if not nome or not preco_str:
                return JsonResponse(
                    {"erro": "Nome e preço são obrigatórios."},
                    status=400
                )

            try:
                preco_decimal = Decimal(preco_str)
            except (InvalidOperation, ValueError):
                return JsonResponse(
                    {"erro": "Preço inválido."},
                    status=400
                )

            if preco_decimal >= Decimal("100000"):
                return JsonResponse(
                    {"erro": "Preço muito alto não aceito."},
                    status=400
                )

            servico = Servico.objects.create(
                nome=nome,
                preco=preco_decimal
            )

            return JsonResponse({
                "id": servico.id,
                "nome": servico.nome,
                "preco": str(servico.preco)
            }, status=201)

        except Exception as e:
            return JsonResponse(
                {"erro": str(e)},
                status=500
            )

    return JsonResponse(
        {"erro": "Método não permitido"},
        status=405
    )