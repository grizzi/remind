import json

from django.contrib.auth.models import User
from django.db import models, transaction
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django_celery_beat.models import CrontabSchedule, IntervalSchedule, PeriodicTask
from djmoney.models.fields import MoneyField
from djmoney.models.validators import MinMoneyValidator
from loguru import logger

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
        verbose_name = "User Settings"
        verbose_name_plural = "Users Settings"

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    remind_within_days = models.BigIntegerField(default=0)
    remind_frequency = models.CharField(
        max_length=20,
        choices=RemindFrequencyChoices,
        default=RemindFrequencyChoices.MONTHLY,
    )
    remind_at_most = models.SmallIntegerField(default=1)
    reminders_active = models.BooleanField(default=True)
    monthly_report_active = models.BooleanField(default=True)
    budget = MoneyField(
        max_digits=10,
        decimal_places=2,
        default=100.0,
        default_currency="USD",
        validators=[MinMoneyValidator(0)],
    )
    plans_monitor = models.OneToOneField(
        PeriodicTask,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="user_settings_plans_monitor",
    )
    report_task = models.OneToOneField(
        PeriodicTask,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="user_settings_report",
    )


@receiver(post_save, sender=UserSettings)
def add_tasks(sender, instance, created, **kwargs):
    if not created:
        return

    try:
        with transaction.atomic():
            user = instance.user
            logger.info("Creating monitoring task")
            plans_monitor_schedule, _ = IntervalSchedule.objects.get_or_create(
                every=1,
                period=IntervalSchedule.HOURS,
            )

            logger.info("Creating plans monitor for this user")
            plans_monitor = PeriodicTask.objects.create(
                interval=plans_monitor_schedule,
                name=f"user_{user.id}_monitor",
                task="api.tasks.create_plans_alert",
                args=json.dumps(
                    [
                        user.id,
                    ]
                ),
            )

            report_schedule, _ = CrontabSchedule.objects.get_or_create(
                minute="0",
                hour="8",
                day_of_week="*",
                day_of_month="1",
                month_of_year="*",
            )

            logger.info("Creating report task for this user")
            report_task = PeriodicTask.objects.create(
                crontab=report_schedule,
                name=f"user_{user.id}_report",
                task="api.tasks.create_report",
                args=json.dumps(
                    [
                        user.id,
                    ]
                ),
            )

            instance.plans_monitor = plans_monitor
            instance.report_task = report_task
            instance.save()
    except Exception as e:
        logger.error(f"Error creating tasks: {e}")
        raise


@receiver(pre_delete, sender=UserSettings)
def delete_tasks(sender, instance, **kwargs):
    _ = sender, kwargs
    if instance.plans_monitor:
        instance.plans_monitor.delete()

    if instance.report_task:
        instance.report_task.delete()


class PlanFrequencyChoices(models.TextChoices):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"


class Plan(models.Model):
    subscription = models.ForeignKey(
        Subscription, on_delete=models.CASCADE, related_name="plans"
    )
    name = models.CharField(max_length=100, default="", null=True, blank=True)
    auto_renew = models.BooleanField(default=True)
    start_date = models.DateField()
    last_reminder_at = models.DateTimeField(null=True, blank=True)
    total_reminders = models.SmallIntegerField(default=0)

    # the next can be null on plans without an explicit end
    end_date = models.DateField(null=True, blank=True)

    # the next two can be null on free plans
    cost = MoneyField(
        max_digits=10,
        decimal_places=2,
        default_currency="CHF",
        null=True,
        blank=True,
        validators=[MinMoneyValidator(0)],
    )
    billing_frequency = models.CharField(
        max_length=20, choices=PlanFrequencyChoices, blank=True, null=True
    )


class Label(models.Model):
    name = models.CharField(max_length=20)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subscription = models.ForeignKey(
        Subscription, on_delete=models.CASCADE, related_name="labels"
    )
