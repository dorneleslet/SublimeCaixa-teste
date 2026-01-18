from django.contrib.auth.decorators import user_passes_test

def grupo_required(*nomes_grupos):
    """Permite acesso apenas a usuários de um grupo específico"""
    def decorator(view_func):
        return user_passes_test(lambda u: u.is_authenticated and u.groups.filter(name__in=nomes_grupos).exists())(view_func)
    return decorator