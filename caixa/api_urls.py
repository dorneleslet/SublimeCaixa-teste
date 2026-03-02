from django.urls import path
from . import api_views

urlpatterns = [
    path('', api_views.listar_vendas_api, name='listar_vendas_api'),
    path('<int:id>/', api_views.relatorio_venda_api, name='relatorio_venda_api'),
    path('criar/', api_views.criar_venda_api, name='criar_venda_api'),


]