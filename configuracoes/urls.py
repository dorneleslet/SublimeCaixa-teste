from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.configuracoes, name='configuracoes'),
    path('usuarios/', views.usuarios, name='usuarios'),
    path('usuarios/adicionar/', views.adicionar_usuario, name='adicionar_usuario'),
    path('usuarios/<int:user_id>/editar/',views.editar_usuario, name='editar_usuario'),
    path('usuarios/<int:user_id>/excluir/', views.excluir_usuario, name='excluir_usuario'),



    # #rota de login/logout
    # path('accounts/login/', auth_views.LoginView.as_view(template_name='registration/login.html'), name='login'),
    # path('accounts/logout/', auth_views.LogoutView.as_view(next_page='/'), name='logout'),

]
