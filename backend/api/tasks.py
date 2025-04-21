from celery import shared_task
from django.core.mail import EmailMultiAlternatives, send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from loguru import logger

from .models import Plan, Subscription, UserSettings


@shared_task
def send_welcome_email(username, user_email):
    logger.info(f"Sending welcome email to {user_email}")

    subject = "Welcome to reMind!"
    html_message = render_to_string("content/welcome_email.html")
    plain_message = strip_tags(html_message)

    email = EmailMultiAlternatives(
        subject=subject,
        body=plain_message,
        from_email="info@re.mind",
        to=[user_email],
    )
    email.attach_alternative(html_message, "text/html")
    email.send()


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
