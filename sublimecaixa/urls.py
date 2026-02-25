from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('clientes/', include('clientes.urls')),
    path('servicos/', include('servicos.urls')),
    path('estoque/', include('estoque.urls')),
    path('caixa/', include('caixa.urls')),
    path('configuracoes/', include('configuracoes.urls')),
    path('api/clientes/', include('clientes.api_urls')),
    path('api/estoque/', include('estoque.api_urls')),
    path('api/servicos/', include('servicos.api_urls')),
    path('api/caixa/', include('caixa.api_urls')),




]
