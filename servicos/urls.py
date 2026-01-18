from django.urls import path
from . import views

urlpatterns = [
    path('novo/', views.novo_servico, name='novo_servico'),
    path('atualiza_servico/', views.atualiza_servico, name='atualiza_servico'),
    path('update_servico/<int:id>', views.update_servico, name='update_servico'),
    path('delete_servico/<int:id>', views.delete_servico, name='delete_servico'),
    path('servicos/buscar/', views.buscar_servicos, name='buscar_servicos'),
    path('servicos/listar/', views.listar_todos_servicos, name='listar_todos_servicos'),

]