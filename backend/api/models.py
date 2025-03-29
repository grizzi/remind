from django.db import models
from django.contrib.auth.models import User
from djmoney.models.fields import MoneyField
from djmoney.models.validators import MinMoneyValidator

# See money django lib: https://github.com/django-money/django-money


class Subscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    remind = models.BooleanField(default=False)
    external_link = models.CharField(default="", blank=True)
    archieved = models.BooleanField(default=False)

class RemindFrequencyChoices(models.TextChoices):
    WEEKLY = "weekly"
    MONTHLY = "monthly"


class UserSettings(models.Model):

    class Meta:
        verbose_name = 'User Settings'
        verbose_name_plural = 'Users Settings'

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    remind_within_days = models.BigIntegerField(default=0)
    remind_frequency = models.CharField(max_length=20,
                                        choices=RemindFrequencyChoices,
                                        default=RemindFrequencyChoices.MONTHLY)
    remind_at_most = models.SmallIntegerField(default=1)
    reminders_active = models.BooleanField(default=True)
    budget = MoneyField(max_digits=10,
                        decimal_places=2,
                        default=100.0,
                        default_currency='USD',
                        validators=[MinMoneyValidator(0)])



class PlanFrequencyChoices(models.TextChoices):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"


class Plan(models.Model):
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name="plans")
    auto_renew  =models.BooleanField(default=True)
    start_date = models.DateField()
    last_reminder_at = models.DateTimeField(null=True, blank=True)
    total_reminders = models.SmallIntegerField(default=0)

    
    # the next can be null on plans without an explicit end
    end_date = models.DateField(null=True, blank=True)
    
    
    # the next two can be null on free plans
    cost = MoneyField(max_digits=10,
                        decimal_places=2,
                        default_currency='CHF',
                        null=True,
                        blank=True,
                        validators=[MinMoneyValidator(0)])
    billing_frequency = models.CharField(max_length=20, choices=PlanFrequencyChoices, blank=True, null=True)
    
    
class Label(models.Model):
    name = models.CharField(max_length=20)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subscription = models.ForeignKey(Subscription,
                                     on_delete=models.CASCADE,
                                     related_name="labels")

