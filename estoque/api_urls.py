from django.urls import path
from . import api_views

urlpatterns = [
    path('', api_views.listar_estoque_api, name='api_listar_estoque'),
    path('<int:id>/', api_views.dados_produto_api, name='api_dados_produto'),
]