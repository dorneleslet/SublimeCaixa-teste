from django.contrib import admin
from .models import ProdutoEstoque, MovimentacaoEstoque

admin.site.register(ProdutoEstoque)
admin.site.register(MovimentacaoEstoque)