from django.db import models

class Servico(models.Model):
      nome = models.CharField(max_length=100) # Nome do serviço, ex: "Corte Feminino"
      preco = models.FloatField() # Preço sem casas fixas
      
      def __str__(self):
            return self.nome # Vai mostrar o nome do serviço no admin e outros lugares
