from django.db import models
from clientes.models import Cliente
from servicos.models import Servico
from estoque.models import ProdutoEstoque
from django.utils import timezone

class Venda(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.SET_NULL, null=True, blank=False)
    data = models.DateTimeField(default=timezone.now)
    desconto = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    sinal = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    profissional = models.CharField(max_length=50, blank=True, null=True)
    observacoes = models.TextField(blank=True, null=True)
    forma_pagamento = models.CharField(max_length=50, choices=[
        ('dinheiro', 'Dinheiro'),
        ('multibanco', 'Multibanco'),
        ('mbway', 'Mbway'),
        ('misto', 'Misto'),
        ('Tranferencia', 'Transferencia'),
        ('pendente', 'Pagamento pendente'),
        ('saida', 'Saida Espaço Sublime')
    ])
    fatura = models.CharField(max_length=10, choices=[
        ('sim', 'Sim'),
        ('nao', 'Nao'),
    ],
    default='nao'
    )
    status = models.CharField(max_length=20, choices=[
        ('pago', 'Pago'),
        ('pendente', 'Pendente'),
    ], default='pago')

    def __str__(self):
        return f"Venda {self.id} - {self.data.strftime('%d/%m/%Y %H:%M')}"

class VendaItem(models.Model):
    venda = models.ForeignKey(Venda, on_delete=models.CASCADE, related_name='itens')
    produto = models.ForeignKey(ProdutoEstoque, on_delete=models.SET_NULL, null=True, blank=True)
    servico = models.ForeignKey(Servico, on_delete=models.SET_NULL, null=True, blank=True)
    #quantidade = models.IntegerField(default=1)
    #valor_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    #campos congelados no momento da venda (para ficar fixo ao atualizar os preços/nomes dos produtos)
    nome_servico = models.CharField(max_length=200, blank=True, null=True)
    nome_produto = models.CharField(max_length=200, blank=True, null=True)
    valor_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    quantidade = models.PositiveBigIntegerField(default=1)

    def __str__(self):
        if self.produto:
            return f"{self.quantidade}x {self.produto.nome}"
        elif self.servico:
            return f"{self.quantidade}x {self.servico.nome}"
        return "Item sem nome"
    
