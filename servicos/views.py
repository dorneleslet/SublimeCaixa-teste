from django.shortcuts import render, redirect
from .models import Servico
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from decimal import Decimal, InvalidOperation
from urllib.parse import urlencode
from django.contrib import messages
from accounts.decorators import grupo_required

def novo_servico(request):
    if request.method == "POST":
        nome = request.POST.get("nome", "").strip()
        preco_str = request.POST.get("preco", "").replace('.', '').replace(',', '.')

        if not nome or not preco_str:
            servicos = Servico.objects.all().order_by('nome') #coloca em ordem alfabetica
            return render(request, "novo_servico.html", {
                "erro": "Por favor, preencha todos os campos obrigatórios.",
                "servicos": servicos
            })
        try:
            preco_decimal = Decimal(preco_str)
        except (InvalidOperation, ValueError):
            servicos = Servico.objects.all().order_by('nome')
            return render(request, 'novo_servico.html', {
                'erro': 'Preço inválido.',
                'servicos': servicos
            })
        
        # limita o valor
        if preco_decimal >= Decimal('100000'):
            servicos = Servico.objects.all().order_by('nome')
            return render(request, 'novo_servico.html', {
                'erro': 'Preço muito alto não aceito.',
                'servicos': servicos
            })

        Servico.objects.create(
            nome=nome,
            preco=preco_decimal,
        )
        messages.success(request, 'Serviço cadastrado com sucesso!')
        return redirect('novo_servico')
  
    servicos = Servico.objects.all().order_by('nome') # coloca em ordem alfabetica
    #mensagem = request.GET.get('mensagem', None)
    return render(request, "novo_servico.html", {"servicos": servicos})


def atualiza_servico(request):
    if request.method == "POST":
        id_servico = request.POST.get("id_servico")
        try:
            servico = Servico.objects.get(id=id_servico)
            return JsonResponse({
                "id": servico.id,
                "nome": servico.nome,
                "preco": f'{servico.preco:.2f}'
                #"preco": str(servico.preco)
            })
        except Servico.DoesNotExist:
            return JsonResponse({'erro': 'Serviço não encontrado'}, status=404)
    return JsonResponse({'erro': 'Método não permitido'}, status=405)
    
@csrf_exempt
def update_servico(request, id):
    if request.method == "POST":
        dados = json.loads(request.body)
        servico = Servico.objects.get(id=id)
        servico.nome = dados.get("nome")
        #servico.preco = dados.get("preco")
        preco_str = dados.get("preco", "").strip().replace(',', '.')
        try:
            servico.preco = Decimal(preco_str)
        except (InvalidOperation, ValueError):
            return JsonResponse({'status': '400', 'erro': 'Preço inválido'})

        servico.save()
        return JsonResponse({"status": "200"})
    return JsonResponse({"status": "400" })


def delete_servico(request, id):
    if request.method == "POST":
        try:
            servico = Servico.objects.get(id=id)
            servico.delete()
            return JsonResponse({"status": "200"})
        except Servico.DoesNotExist:
            return JsonResponse({"status": "404"})
    return JsonResponse({"status": "400"})

def buscar_servicos (request):
    q = request.GET.get('q', '')
    servicos = Servico.objects.filter(
        Q(nome__icontains=q)
    ).order_by('nome').values('id', 'nome', 'preco')[:10]

    return JsonResponse({'servicos': list(servicos)})

def listar_todos_servicos(request):
    servicos = Servico.objects.all().order_by('nome').values('id', 'nome', 'preco')
    return JsonResponse({'servicos': list(servicos)})

