from django.contrib import admin
from .models import Subscription, Label, SubscriptionLabel


admin.site.register(Subscription)
admin.site.register(Label)
admin.site.register(SubscriptionLabel)
