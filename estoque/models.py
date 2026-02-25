from django.db import models

class ProdutoEstoque(models.Model):
    nome = models.CharField(max_length=100)
    #quantidade = models.PositiveIntegerField(default=0)
    preco_unitario = models.FloatField()
    descricao = models.TextField(blank=True, null=True)

    @property
    def quantidade(self):
        entradas = self.movimentacoes.filter(tipo=MovimentacaoEstoque.ENTRADA).aggregate(total=models.Sum('quantidade'))['total'] or 0
        saidas = self.movimentacoes.filter(tipo=MovimentacaoEstoque.SAIDA).aggregate(total=models.Sum('quantidade'))['total'] or 0
        return entradas - saidas
    #def __str__(self):
    #    return self.nome
    
class MovimentacaoEstoque(models.Model):
    ENTRADA = 'entrada'
    SAIDA = 'saida'
    TIPOS = [
        (ENTRADA, 'Entrada'),
        (SAIDA, 'Saída'),
    ]
    produto = models.ForeignKey(ProdutoEstoque, related_name="movimentacoes", on_delete=models.CASCADE)
    cliente = models.ForeignKey('clientes.Cliente', related_name='movimentacoes', on_delete=models.SET_NULL, null=True, blank=True)
    tipo = models.CharField(max_length=10, choices=TIPOS)
    quantidade = models.PositiveIntegerField()
    data = models.DateTimeField(auto_now_add=True)

    #def __str__(self):
    #    return f"{self.get_tipo_display()} - {self.produto.nome} ({self.quantidade})"