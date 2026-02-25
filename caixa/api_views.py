from django.http import JsonResponse
from .models import Venda
from django.views.decorators.csrf import csrf_exempt

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