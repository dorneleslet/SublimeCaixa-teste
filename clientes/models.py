from django.db import models
from django.utils import timezone

class Cliente(models.Model):
    nome = models.CharField(max_length=50)
    telefone = models.CharField(max_length=14)
    nif = models.CharField(max_length=12)
    nascimento = models.DateField(max_length=8, null=True, blank=True)
    email = models.EmailField(max_length=50, null=True, blank=True)

    ativo = models.BooleanField(default=True)
    
    def __str__(self) ->str:
            return self.nome
        
class FichaCliente(models.Model):
      cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name="fichas")
      data = models.DateTimeField(default=timezone.now)
      profissional = models.CharField(max_length=50, default='')
      valor = models.FloatField(default=0.0)
      procedimento = models.TextField(blank=True, null=True)
      homecare = models.TextField(blank=True, null=True)
      observacao = models.TextField(blank=True, null=True)

      def __str__(self):
            return f'Ficha de {self.cliente.nome} - {self.data}'
      