import os
from datetime import date, timedelta

from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.db import models
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.encoding import force_bytes
from django.utils.html import strip_tags
from django.utils.http import urlsafe_base64_encode
from loguru import logger

from .models import (
    Plan,
    RemindFrequencyChoices,
    Subscription,
    User,
    UserSettings,
)
from .tokens import account_activation_token


@shared_task
def send_welcome_email(user_pk):
    user = User.objects.get(pk=user_pk)
    logger.info(f"Sending welcome email to {user.email}")

    welcome_message = "Welcome to reMind!"
    token = account_activation_token.make_token(user)
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    endpoint = os.environ.get("WEBAPP_ENDPOINT", "http://localhost:5173")
    activation_link = f"{endpoint}/activate/{uidb64}/{token}"

    context = {
        "backend_endpoint": os.environ.get("BACKEND_ENDPOINT", "http://localhost:8000"),
        "username": user.username,
        "welcome_message": welcome_message,
        "link_app": activation_link,
    }

    subject = "Welcome to reMind!"
    html_message = render_to_string("welcome_email.html", context=context)
    plain_message = strip_tags(html_message)

    email = EmailMultiAlternatives(
        subject=subject,
        body=plain_message,
        from_email="noreply@remnd.co",
        to=[user.email],
    )
    email.attach_alternative(html_message, "text/html")
    email.send()


@shared_task
def send_reset_email(user_pk):
    user = User.objects.get(pk=user_pk)
    logger.info(f"Sending password reset email to {user.email}")

    token = account_activation_token.make_token(user)
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    endpoint = os.environ.get("WEBAPP_ENDPOINT", "http://localhost:5173")
    reset_link = f"{endpoint}/password-reset/{uidb64}/{token}"

    context = {
        "backend_endpoint": os.environ.get("BACKEND_ENDPOINT", "http://localhost:8000"),
        "username": user.username,
        "reset_link": reset_link,
    }

    subject = "Password Reset Request"
    html_message = render_to_string("password_reset_email.html", context=context)
    plain_message = strip_tags(html_message)

    email = EmailMultiAlternatives(
        subject=subject,
        body=plain_message,
        from_email="noreply@remnd.co",
        to=[user.email],
    )
    email.attach_alternative(html_message, "text/html")
    email.send()


@shared_task
def alert_and_update(user_id):
    create_plans_alert(user_id)
    renew_plans(user_id)


def create_plans_alert(user_id):
    logger.info(f"Creating plans alert for user {user_id}")
    user_settings: UserSettings = UserSettings.objects.get(user=user_id)
    if not user_settings.reminders_active:
        logger.info(f"Reminders are disabled for user {user_id}")
        return

    # Compute time information
    today = date.today()
    now = timezone.now()

    max_reminders: int = user_settings.remind_at_most

    # Remind frequency
    remind_again_after = today - timedelta(days=1)
    if user_settings.remind_frequency == RemindFrequencyChoices.WEEKLY:
        remind_again_after = now - timedelta(weeks=1)
    elif user_settings.remind_frequency == RemindFrequencyChoices.MONTHLY:
        remind_again_after = now - timedelta(weeks=4)

    # Each plan with its end date within the configured buffer
    expiring_soon_date = today + timedelta(days=user_settings.remind_within_days)

    logger.info(f"Remind again after: {remind_again_after}")
    logger.info(f"Expiring soon date: {expiring_soon_date}")

    # Get all plans that are eligible for reminders
    # for all the subscriptions of this user
    # To send an alert the following conditions must be met:
    # 1. The end date - remind buffer is in the past
    # 2. The last reminder is more than remind frequency ago in the past
    # 3. The total reminders is less than the max reminders
    # 4. There has been no reminder sent yet
    subs = Subscription.objects.filter(user=user_id)
    plans_to_remind = {}
    for sub in subs:
        sub_plans_to_remind: list[Plan] = (
            sub.plans.filter(
                end_date__lte=expiring_soon_date,
                total_reminders__lt=max_reminders,
            )
            .filter(
                models.Q(last_reminder_at__isnull=True)
                | models.Q(last_reminder_at__lt=remind_again_after)
            )
            .order_by("end_date")
        )

        if sub_plans_to_remind:
            plans_to_remind[sub.title] = list(sub_plans_to_remind)

    plans_updated = []
    for plans in plans_to_remind.values():
        for plan in plans:
            plan.last_reminder_at = now
            plan.total_reminders += 1
            plans_updated.append(plan)

    try:
        if plans_updated:
            Plan.objects.bulk_update(
                plans_updated, ["last_reminder_at", "total_reminders"]
            )
            logger.info(f"Updated {len(plans_updated)} plans with reminders")
    except Exception as exc:
        logger.error(f"Error updating plans! {exc}")

    if len(plans_to_remind) == 0:
        logger.info("No plans to remind")
        return
    else:
        logger.info(f"Plans to remind: {plans_to_remind}")

    # Send email with all the plans to remind
    user = User.objects.get(id=user_id)
    context = {
        "backend_endpoint": os.environ.get("BACKEND_ENDPOINT", "http://localhost:8000"),
        "username": user.username,
        "plans_to_remind": plans_to_remind,
        "remind_within_days": user_settings.remind_within_days,
        "remind_at_most": user_settings.remind_at_most,
    }

    subject = "reMind Alert"
    html_message = render_to_string("alert_email.html", context=context)
    plain_message = strip_tags(html_message)

    email = EmailMultiAlternatives(
        subject=subject,
        body=plain_message,
        from_email="info@remnd.co",
        to=[user.email],
    )
    email.attach_alternative(html_message, "text/html")
    email.send()


def renew_plans(user_id):
    logger.info(f"Renewing plans for user {user_id}")
    plans = Plan.objects.filter(subscription__user_id=user_id)
    plans_to_update = []
    for plan in plans:
        logger.info(
            f"Plan: {plan.name}, start date: {plan.start_date}, end date: {plan.end_date}"
        )
        if plan.end_date and plan.end_date <= timezone.now().date():
            if plan.auto_renew:
                logger.info("Renewing plan...")
                plan_duration = plan.end_date - plan.start_date
                plan.start_date = plan.end_date + timedelta(days=1)
                plan.end_date = plan.start_date + plan_duration
                plan.renewed = True
            else:
                plan.expired = True
                logger.info("Plan expired!")
            plans_to_update.append(plan)
        else:
            logger.info("Plan is not expired yet!")

    if plans_to_update:
        Plan.objects.bulk_update(
            plans_to_update, ["start_date", "end_date", "renewed", "expired"]
        )


def created_last_month(user_id):
    today = timezone.now().date()
    last_date_last_month = today.replace(day=1) - timedelta(days=1)

    # Created plans are those plans that have a start date in the last month
    # and have not been renewed, rather created.
    created = Plan.objects.filter(
        subscription__user_id=user_id,
        start_date__month=last_date_last_month.month,
        renewed=False,
    ).exclude(end_date__month=last_date_last_month.month)

    return list(created)


def renewed_last_month(user_id):
    today = timezone.now().date()
    last_date_last_month = today.replace(day=1) - timedelta(days=1)

    # Renewed plans are those plans that have a start date in the last month
    # and have been renewed.
    renewed = Plan.objects.filter(
        subscription__user_id=user_id,
        start_date__month=last_date_last_month.month,
        start_date__year=last_date_last_month.year,
        renewed=True,
    )

    return list(renewed)


def expired_last_month(user_id):
    today = timezone.now().date()
    last_date_last_month = today.replace(day=1) - timedelta(days=1)

    # Expired plans are those that do not renew and have an end date in the last month
    expired = Plan.objects.filter(
        subscription__user_id=user_id,
        end_date__year__lte=last_date_last_month.year,
        end_date__month=last_date_last_month.month,
        renewed=False,
    )

    return list(expired)


@shared_task
def send_monthly_report(user_id):
    today = timezone.now().date()
    last_date_last_month = today.replace(day=1) - timedelta(days=1)

    created = created_last_month(user_id)
    renewed = renewed_last_month(user_id)
    expired = expired_last_month(user_id)

    user = User.objects.get(id=user_id)
    settings = UserSettings.objects.get(user=user_id)
    if not settings.monthly_report_active:
        return

    logger.info(f"Expired last month: {expired}")
    context = {
        "backend_endpoint": os.environ.get("BACKEND_ENDPOINT", "http://localhost:8000"),
        "username": user.username,
        "report_month": last_date_last_month.strftime("%B %Y"),
        "current_year": today.year,
        "new_subscriptions": [
            {
                "title": plan.subscription.title,
                "plan_name": plan.name,
                "start_date": plan.start_date,
                "end_date": plan.end_date,
                "cost": plan.cost.amount,
                "currency": settings.budget.currency,  # plan.cost.currency, TODO(giuseppe) when supporting more than one currency
            }
            for plan in created
        ],
        "expired_subscriptions": [
            {
                "title": plan.subscription.title,
                "plan_name": plan.name,
                "end_date": plan.end_date,
            }
            for plan in expired
        ],
        "renewed_subscriptions": [
            {
                "title": plan.subscription.title,
                "plan_name": plan.name,
                "old_end": plan.start_date - timedelta(days=1),
                "new_start": plan.start_date,
                "new_end": plan.end_date,
                "cost": plan.cost.amount,
                "currency": settings.budget.currency,  # plan.cost.currency, TODO(giuseppe) when supporting more than one currency
            }
            for plan in renewed
        ],
    }

    subject = "Subscription Report"
    html_message = render_to_string("report_email.html", context)
    plain_message = strip_tags(html_message)

    email = EmailMultiAlternatives(
        subject=subject,
        body=plain_message,
        from_email="info@remnd.co",
        to=[user.email],
    )
    email.attach_alternative(html_message, "text/html")
    email.send()
