from datetime import date, timedelta

from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.db import models
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.html import strip_tags
from loguru import logger

from .models import Plan, RemindFrequencyChoices, Subscription, User, UserSettings


@shared_task
def send_welcome_email(username, user_email):
    logger.info(f"Sending welcome email to {user_email}")

    welcome_message = "Welcome to reMind!"
    link_app = "http://localhost:5173"
    context = {
        "username": username,
        "welcome_message": welcome_message,
        "link_app": link_app,
    }

    subject = "Welcome to reMind!"
    html_message = render_to_string("welcome_email.html", context=context)
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
def alert_and_update(user_id):
    create_plans_alert(user_id)
    renew_plans(user_id)


@shared_task
def create_plans_alert(user_id):
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
        from_email="info@re.mind",
        to=[user.email],
    )
    email.attach_alternative(html_message, "text/html")
    email.send()


@shared_task
def renew_plans(user_id):
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
            else:
                plan.exprired = True
                logger.info("Plan expired!")
            plans_to_update.append(plan)
        else:
            logger.info("Plan is not expired yet!")

    if plans_to_update:
        Plan.objects.bulk_update(plans_to_update, ["start_date", "end_date"])


@shared_task
def create_report(user_id):
    user_settings: UserSettings = UserSettings.objects.get(user=user_id)
    if not user_settings.monthly_report_active:
        return
