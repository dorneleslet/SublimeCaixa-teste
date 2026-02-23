from django.urls import path
from . import views
urlpatterns = [
    path('', views.clientes, name="clientes"),
    path('atualiza_cliente/', views.att_cliente, name='atualiza_cliente'),
    path('update_cliente/<int:id>', views.update_cliente, name='update_cliente'),
    path('buscar/', views.buscar_clientes, name='buscar_clientes'),
    path('dados_cliente/<int:id>/', views.dados_cliente, name='dados_cliente'),
    path('clientes/listar/', views.listar_todos_clientes, name='listar_clientes'),
    path('<int:cliente_id>/ficha/adicionar/', views.adicionar_ficha, name='adicionar_ficha'),
    path('<int:cliente_id>/detalhe/', views.detalhe_cliente, name='detalhe_cliente'),
    path('<int:cliente_id>/ocultar/', views.ocultar_cliente, name='ocultar_cliente'),
    path('ficha/<int:ficha_id>/excluir/', views.excluir_ficha, name='excluir_ficha'),
    path('ficha/<int:ficha_id>/detalhes/', views.ficha_detalhes, name='ficha_detalhes'),
    path('ficha/<int:ficha_id>/update/', views.update_ficha, name='update_ficha'),


]