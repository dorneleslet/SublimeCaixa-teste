from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User, Group
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from accounts.decorators import grupo_required

def configuracoes(request):
    return render(request, 'configuracoes.html')

#só admin_required pode gerenciar usuários
def admin_required(view_func):
    return user_passes_test(lambda u: u.is_superuser)(view_func)


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