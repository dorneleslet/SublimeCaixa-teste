from django.shortcuts import redirect
from django.urls import reverse
from django.conf import settings

class LoginRequiredMiddleware:
    """
    Middleware para exigir login em todas as páginas,
    exceto as explicitamente liberadas.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # URLs que NÃO exigem login
        allowed_paths = [
            reverse("login"),      # sua página de login
            reverse("logout"),     # sua página de logout
        ]

        # Permite também o admin e arquivos estáticos
        if (
            request.path.startswith("/admin/") or
            request.path.startswith(settings.STATIC_URL)
        ):
            return self.get_response(request)

        # Redireciona se o usuário não estiver logado e tentar acessar algo protegido
        if not request.user.is_authenticated and request.path not in allowed_paths:
            return redirect(reverse("login"))

        return self.get_response(request)