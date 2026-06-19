from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User, Group
from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from clientes.models import ActionLog # Import ActionLog from clientes app
from django.core.paginator import Paginator
from django.core.cache import cache

import requests
import re
import json

#Helper para verificar se o usuário é administrador
def is_admin_check(user):
    return user.groups.filter(name='Administrador').exists() or user.is_superuser

@login_required
def configuracoes(request):
    # Esta view renderiza o configuracoes.html principal
    is_admin = request.user.groups.filter(name='Administrador').exists() or request.user.is_superuser
    # return render(request, 'configuracoes.html') #AQUI FUNCIONANDO
    return render(request, 'configuracoes.html', {'is_admin': is_admin})

def dashboard(request): #AQUI FUNCIONANDO
    is_admin = request.user.groups.filter(name='Administrador').exists() or request.user.is_superuser
    return render(request, 'dashboard.html', {'is_admin': is_admin} )

@login_required
@user_passes_test(is_admin_check) # Apenas administradores podem ver o histórico de ações
def historico_acoes(request):
    logs_list = ActionLog.objects.all().order_by('-timestamp') 
    paginator = Paginator(logs_list, 20) # Define 20 logs por página

    page_number = request.GET.get('page')
    logs = paginator.get_page(page_number)

    is_admin = request.user.groups.filter(name='Administrador').exists() or request.user.is_superuser
    return render(request, 'configuracoes/historico_acoes.html', {'logs': logs})

def usuarios(request):
    users = User.objects.all()
    grupos = Group.objects.all()
    return render(request, 'usuarios.html', {'users': users, 'grupos': grupos})


def adicionar_usuario(request):
    grupos_fixos = Group.objects.filter(name__in=[
        'Administrador', # acesso geral
        'Colaborador', # caixa e clientes
    ])
    #grupos = Group.objects.all()
    if request.method == 'POST':
        username = request.POST.get('username')
        senha = request.POST.get('password')
        gruponome = request.POST.get('grupo')

        if username and senha and gruponome:
            if User.objects.filter(username=username).exists():
                messages.error(request, f'Usuário "{username}" já existe!')
            else:
                user = User.objects.create_user(username=username, password=senha) #cria o usuário
                grupo = get_object_or_404(Group, id=gruponome) # pega ou cria o grupo
                user.groups.add(grupo)
                user.save()
                messages.success(request, f'Usuário {username} criado com sucesso!')
                return redirect('usuarios')
        else:
            messages.error(request, 'Preencha todos os campos!')
    return render(request, 'configuracoes/adicionar_usuario.html', {'grupos': grupos_fixos})


def editar_usuario(request, user_id):
    user = get_object_or_404(User, id=user_id)
    grupos = Group.objects.filter(name__in=['Administrador', 'Colaborador'])

    if request.method == 'POST':
        username = request.POST.get('username')
        grupo_id = request.POST.get('grupo')

        if username and grupo_id:
            user.username = username
            grupo = Group.objects.get(id=grupo_id)
            user.groups.clear()
            user.groups.add(grupo)
            user.save()
            messages.success(request, f'Usuário {username} atualizado!')
            return redirect('usuarios')
        else:
            messages.error(request, 'Preencha todos os campos!')
    return render(request, 'configuracoes/editar_usuario.html', {'user': user, 'grupos': grupos})


def excluir_usuario(request, user_id):
    user = get_object_or_404(User, id=user_id)
    user.delete()
    messages.success(request, 'Usuário excluído!')
    return redirect('usuarios')

def criar_grupos_iniciais():
    grupos = ['Administrador', 'Colaborador']
    for nome in grupos:
        grupo, criado = Group.objects.get_or_create(name=nome)
        if criado:
            print(f'Grupo {nome} criado!')

def message(request):
    return render(request, 'message.html')

def landing_page_view(request):
    """Renderiza a landing page. Tenta buscar as últimas imagens do Instagram do perfil
    'espaco_sublime.pt' e passa uma lista de URLs para o template em 'instagram_images'.
    O resultado é cacheado por 1 hora para reduzir requests.
    """
    instagram_images = cache.get('instagram_images')
    if instagram_images is None:
        instagram_images = []
        try:
            url = 'https://www.instagram.com/espaco_sublime.pt/'
            headers = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36'}
            resp = requests.get(url, headers=headers, timeout=10)
            html = resp.text

            print(resp.status_code)
            print(html[:500])

            # Tenta extrair JSON do window._sharedData (formato que ainda aparece em algumas páginas)
            m = re.search(r'window\._sharedData = (.*?);</script>', html, re.DOTALL)
            data = None
            if m:
                try:
                    data = json.loads(m.group(1))
                except Exception:
                    data = None

            # Alternativa: buscar o bloco 'ProfilePage' caso _sharedData não funcione
            if not data:
                m2 = re.search(r'"ProfilePage"\s*:\s*\[\{(.*?)\}\]\,', html, re.DOTALL)
                if m2:
                    # tenta recuperar por meio de fragmento; não garantido
                    try:
                        # busca trecho mais amplo e tenta localizar json via outra regex
                        m3 = re.search(r'window\.__additionalDataLoaded\(([^,]+),\s*(\{.*?\})\);', html, re.DOTALL)
                        if m3:
                            data = json.loads(m3.group(2))
                    except Exception:
                        data = None

            images = []
            if data:
                try:
                    edges = data.get('entry_data', {}).get('ProfilePage', [])[0].get('graphql', {}).get('user', {}).get('edge_owner_to_timeline_media', {}).get('edges', [])
                    for edge in edges[:5]:
                        node = edge.get('node', {})
                        url_img = node.get('display_url') or node.get('thumbnail_src')
                        if url_img:
                            images.append(url_img)
                except Exception:
                    images = []

            instagram_images = images
            # Garantir exatamente 4 imagens (preencher com placeholders se necessário)
            placeholder = 'https://via.placeholder.com/400x400.png?text=Sublime'
            while len(instagram_images) < 4:
                instagram_images.append(placeholder)
            instagram_images = instagram_images[:4]
        except Exception:
            instagram_images = []

        # Cache por 1 hora
        cache.set('instagram_images', instagram_images, 60 * 60)

    return render(request, 'landing_page.html', {'instagram_images': instagram_images})

def embaralhar_lista(request):
    return render(request, 'embaralhar.html')
