from django.urls import path
from . import views

urlpatterns = [
    path('', views.listar_estoque, name='listar_estoque'),
    path('novo/', views.novo_produto, name='novo_produto'),
    path('editar/<int:id>/', views.editar_produto, name='editar_produto'),
    path('estoque/editar/<int:id>/', views.get_produto, name='atualizar_produto'),
    path('excluir/<int:id>/', views.excluir_produto, name='excluir_produto'),
    path('produtos/lista/', views.lista_produtos, name='lista_produtos'),
    path('relatorio/', views.relatorio_estoque, name='relatorio_estoque'),
    
]