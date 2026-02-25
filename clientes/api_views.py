from django.http import JsonResponse
from .models import Cliente
from django.views.decorators.csrf import csrf_exempt


def listar_clientes_api(request):
    clientes = (
        Cliente.objects
        .filter(ativo=True)
        .order_by('nome')
        .values('id', 'nome', 'telefone', 'nif')
    )

    return JsonResponse(list(clientes), safe=False)


def dados_cliente_api(request, id):
    try:
        cliente = Cliente.objects.get(id=id, ativo=True)

        dados = {
            'id': cliente.id,
            'nome': cliente.nome,
            'telefone': cliente.telefone,
            'email': cliente.email,
            'nif': cliente.nif,
        }

        return JsonResponse(dados)

    except Cliente.DoesNotExist:
        return JsonResponse(
            {'erro': 'Cliente não encontrado'},
            status=404
        )