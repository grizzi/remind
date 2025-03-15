from django.contrib import admin
from .models import Subscription, Label, Transaction, UserSettings


admin.site.register(Subscription)
admin.site.register(Label)
admin.site.register(Transaction)
admin.site.register(UserSettings)
