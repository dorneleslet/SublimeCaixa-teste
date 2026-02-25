from django.http import JsonResponse
from .models import Servico
from django.views.decorators.csrf import csrf_exempt

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