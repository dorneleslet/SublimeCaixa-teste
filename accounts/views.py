from django.shortcuts import render

from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            # pega a URL salva na sessão
            next_url = request.session.pop('next', None)
            if next_url:
                return redirect(next_url)
            return redirect('home')  # fallback para página inicial
        else:
            return render(request, 'login.html', {'error': 'Usuário ou senha inválidos'})
    return render(request, 'login.html')