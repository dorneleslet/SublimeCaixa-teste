from django.urls import path
from . import views

#app_name = "caixa"

urlpatterns = [
    path('', views.caixa_principal, name='caixa_principal'),
    path('finalizar/', views.finalizar_venda, name='finalizar_venda'),
    path('buscar-clientes/', views.buscar_clientes, name='buscar_clientes'),
    path('detalhes_cliente/<int:cliente_id>/', views.detalhes_cliente, name='detalhes_cliente'),
    path('buscar-servicos/', views.buscar_servico, name='buscar_servico'),
    path('buscar-produtos/', views.buscar_produto, name='buscar_produto'),
    path('historico/', views.historico_vendas, name='historico_vendas'),
    path('relatorio/<int:venda_id>', views.relatorio_venda, name='relatorio_venda'),
    
]