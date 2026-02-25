import json
from datetime import datetime
import re

from django.http import JsonResponse
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q

from .models import Cliente

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
    
@csrf_exempt  # ok pra dev/local; em produção a gente troca por token
def criar_cliente_api(request):
    if request.method != "POST":
        return JsonResponse({"erro": "Método não permitido"}, status=405)

    # 1) ler JSON
    try:
        body = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"erro": "JSON inválido"}, status=400)

    nome = (body.get("nome") or "").strip()
    telefone = (body.get("telefone") or "").strip()
    nif = (body.get("nif") or "").strip()
    email = (body.get("email") or "").strip() or None
    nascimento_str = (body.get("nascimento") or "").strip() or None

    erros = {}

    # 2) validações mínimas (igual seu sistema)
    if not nome:
        erros["nome"] = "Nome é obrigatório."
    
    # ajuste aqui se você quiser aceitar sem '+'
    if (not telefone) or (not telefone.startswith("+")) or (not telefone[1:].isdigit()) or (len(telefone) < 10) or (len(telefone) > 15):
        erros["telefone"] = "Telefone inválido. Use formato +351912345678."

    if not nif:
        erros["nif"] = "NIF é obrigatório."

    if nif:
        if len(nif) != 9 or (not nif.isdigit()):
            erros["nif"] = "NIF deve ter 9 dígitos numéricos."

    # email opcional, mas se vier, valida
    if email:
        padrao_email = re.compile(r"([A-Za-z0-9]+[.\-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Za-z]{2,})+")
        if not re.fullmatch(padrao_email, email):
            erros["email"] = "E-mail inválido."

    nascimento = None
    if nascimento_str:
        try:
            nascimento = datetime.strptime(nascimento_str, "%d/%m/%Y").date()
        except ValueError:
            erros["nascimento"] = "Data inválida. Use DD/MM/AAAA."

    if erros:
        return JsonResponse({"erro": "Validação falhou", "campos": erros}, status=400)

    # 3) regra de negócio: NIF único (se você usa isso)
    if nif and Cliente.objects.filter(nif=nif).exists():
        return JsonResponse({"erro": "Cliente com este NIF já existe."}, status=409)

    # 4) criar
    try:
        cliente = Cliente.objects.create(
            nome=nome,
            telefone=telefone,
            nif=nif,
            email=email,
            nascimento=nascimento,
            ativo=True
        )
    except IntegrityError:
        return JsonResponse({"erro": "Erro de integridade ao salvar."}, status=400)

    # 5) retorno REST: 201 Created
    return JsonResponse({
        "id": cliente.id,
        "nome": cliente.nome,
        "telefone": cliente.telefone,
        "nif": cliente.nif,
        "email": cliente.email or "",
        "nascimento": cliente.nascimento.strftime("%d/%m/%Y") if cliente.nascimento else ""
    }, status=201)