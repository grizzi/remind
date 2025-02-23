from django.db import models
from django.contrib.auth.models import User
from djmoney.models.fields import MoneyField

# See money django lib: https://github.com/django-money/django-money
# TODO: give a string representation of models

class Subscription(models.Model):
    title = models.CharField(max_length=100, default="")
    amount = MoneyField(max_digits=10, decimal_places=2, default_currency='USD', null=True)
    created_at = models.DateField(auto_now_add=True)
    billed_at = models.DateField()
    remind = models.BooleanField(default=False)
    autorenewal = models.BooleanField(default=False)
    expiration_at = models.DateField(null=True)
    expiring_at = models.DateField(null=True)
    external_link = models.URLField(default="")
    archieved = models.BooleanField(default=False)
    last_reminder_at = models.DateField(null=True)
    total_reminders = models.SmallIntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class Label(models.Model):
    name = models.CharField(max_length=20)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class SubscriptionLabel(models.Model):
    label = models.ForeignKey(Label, on_delete=models.CASCADE)
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE)
    
    def save(self, *args, **kwargs):
        if self.subscription.user != self.label.user:
            raise ValueError("Subscription and Label must belong to the same user.")
        super().save(*args, **kwargs)
