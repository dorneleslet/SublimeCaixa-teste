from django.urls import path
from . import api_views

urlpatterns = [
    path('', api_views.listar_clientes_api, name='api_listar_clientes'),
    path('<int:id>/', api_views.dados_cliente_api, name='api_dados_cliente'),
    path('criar/', api_views.criar_cliente_api, name='criar_cliente_api'),

]