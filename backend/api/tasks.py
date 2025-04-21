from celery import shared_task
from django.core.mail import send_mail
from loguru import logger

from .models import Plan, Subscription, UserSettings


@shared_task
def send_welcome_email(username, user_email):
    logger.info(f"Sending welcome email to {user_email}")
    send_mail(
        "Welcome to reMind!",
        f"Hello, {username}! Welcome to reMind. We are glad to have you on board.",
        "info@re.mind",
        [user_email],
        fail_silently=False,
    )


@shared_task
def create_plans_alert(user_id):
    user_settings: UserSettings = UserSettings.objects.get(user=user_id)
    if not user_settings.reminders_active:
        return

    subs = Subscription.objects.filter(user=user_id)
    report = []
    for sub in subs:
        entry = {"subscription": sub.title, "plans": []}
        plans = Plan.objects.filter(subscription=sub)
        for plan in plans:
            entry["plans"].append(plan.name)
        report.append(entry)

    send_mail(
        "reMind report",
        f"{report}",
        "info@re.mind",
        [user_settings.user.email],
        fail_silently=True,
    )


@shared_task
def create_report(user_id):
    user_settings: UserSettings = UserSettings.objects.get(user=user_id)
    if not user_settings.monthly_report_active:
        return
