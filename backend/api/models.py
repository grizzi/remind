from django.db import models
from django.contrib.auth.models import User
from djmoney.models.fields import MoneyField
from djmoney.models.validators import MinMoneyValidator

# See money django lib: https://github.com/django-money/django-money


class Subscription(models.Model):
    title = models.CharField(max_length=100, default="")
    amount = MoneyField(max_digits=10,
                        decimal_places=2,
                        default_currency='CHF',
                        null=True,
                        validators=[MinMoneyValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)
    date_start = models.DateField()
    date_end = models.DateField()
    remind = models.BooleanField(default=False)
    autorenewal = models.BooleanField(default=False)
    expiring_at = models.DateTimeField(null=True)
    external_link = models.CharField(default="", blank=True)
    archieved = models.BooleanField(default=False)
    last_reminder_at = models.DateTimeField(null=True, blank=True)
    total_reminders = models.SmallIntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class RemindFrequencyChoices(models.TextChoices):
    WEEKLY = "W"
    MONTHLY = "M"


class UserSettings(models.Model):

    class Meta:
        verbose_name = 'User Settings'
        verbose_name_plural = 'Users Settings'

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    remind_within_days = models.BigIntegerField(default=0)
    remind_frequency = models.CharField(max_length=1,
                                        choices=RemindFrequencyChoices,
                                        default=RemindFrequencyChoices.MONTHLY)
    remind_at_most = models.SmallIntegerField(default=1)
    reminders_active = models.BooleanField(default=True)
    budget = MoneyField(max_digits=10,
                        decimal_places=2,
                        default=100.0,
                        default_currency='USD',
                        validators=[MinMoneyValidator(0)])


class Label(models.Model):
    name = models.CharField(max_length=20)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subscription = models.ForeignKey(Subscription,
                                     on_delete=models.CASCADE,
                                     related_name="labels")


class Transaction(models.Model):
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE)
    date = models.DateTimeField()
    amount = MoneyField(max_digits=10,
                        decimal_places=2,
                        default_currency='USD',
                        validators=[MinMoneyValidator(0)])
