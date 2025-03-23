from django.contrib import admin
from .models import Subscription, Label, Plan, UserSettings


admin.site.register(Subscription)
admin.site.register(Label)
admin.site.register(Plan)
admin.site.register(UserSettings)
