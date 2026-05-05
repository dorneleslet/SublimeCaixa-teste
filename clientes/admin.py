from django.contrib import admin
from .models import Cliente, FichaCliente
from .models import ActionLog

admin.site.register(ActionLog)
admin.site.register(Cliente)
admin.site.register(FichaCliente)
