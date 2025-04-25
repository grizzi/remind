from datetime import timedelta
from unittest.mock import patch

from django.test import TestCase
from django.utils import timezone
from loguru import logger

from api.models import Plan, RemindFrequencyChoices, Subscription, User, UserSettings
from api.tasks import create_plans_alert


class ExpiringPlansReminderTest(TestCase):
    EXPIRATION_WITHIN_DAYS = 7
    REMIND_FREQUENCY = RemindFrequencyChoices.WEEKLY
    REMIND_FREQUENCY_DAYS = 7
    REMIND_AT_MOST = 3

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="pass"
        )
        self.settings = UserSettings.objects.create(
            user=self.user,
            reminders_active=True,
            remind_frequency=ExpiringPlansReminderTest.REMIND_FREQUENCY,
            remind_at_most=ExpiringPlansReminderTest.REMIND_AT_MOST,
            remind_within_days=ExpiringPlansReminderTest.EXPIRATION_WITHIN_DAYS,
        )
        self.subscription = Subscription.objects.create(user=self.user, title="reMind")

    def makeExpiringDate(self):
        return timezone.now().date() - timedelta(days=2)

    def makeNotExpiringDate(self):
        return timezone.now().date() + timedelta(
            days=ExpiringPlansReminderTest.EXPIRATION_WITHIN_DAYS + 1
        )

    @patch("api.tasks.EmailMultiAlternatives")
    def test_does_not_send_if_reminders_inactive(self, mock_email_class):
        logger.info("Testing reminders inactive")
        email = mock_email_class.return_value
        self.settings.reminders_active = False
        self.settings.save()

        create_plans_alert(self.user.id)
        email.send.assert_not_called()

    @patch("api.tasks.EmailMultiAlternatives")
    def test_sends_reminder_email_for_expiring_plans(self, mock_email_class):
        email = mock_email_class.return_value

        plan = Plan.objects.create(
            subscription=self.subscription,
            name="Expiring Plan",
            start_date=timezone.now().date() - timedelta(days=100),
            end_date=self.makeExpiringDate(),
            last_reminder_at=None,
            total_reminders=0,
        )

        create_plans_alert(self.user.id)

        email.send.assert_called_once()

        plan.refresh_from_db()
        self.assertEqual(plan.total_reminders, 1)
        self.assertIsNotNone(plan.last_reminder_at)

    @patch("api.tasks.EmailMultiAlternatives")
    def test_does_not_remind_if_plan_is_not_expiring(self, mock_email_class):
        email = mock_email_class.return_value
        Plan.objects.create(
            subscription=self.subscription,
            name="Pro Plan",
            start_date=timezone.now().date() - timedelta(days=100),
            end_date=self.makeNotExpiringDate(),
            last_reminder_at=None,
            total_reminders=0,
        )

        create_plans_alert(self.user.id)
        email.send.assert_not_called()

    @patch("api.tasks.EmailMultiAlternatives")
    def test_does_not_remind_too_soon(self, mock_email_class):
        email = mock_email_class.return_value
        Plan.objects.create(
            subscription=self.subscription,
            name="Pro Plan",
            start_date=timezone.now().date() - timedelta(days=100),
            end_date=self.makeExpiringDate(),
            last_reminder_at=timezone.now().date(),
            total_reminders=1,
        )

        create_plans_alert(self.user.id)
        email.send.assert_not_called()

    @patch("api.tasks.EmailMultiAlternatives")
    def test_remind_again_after_enough_time(self, mock_email_class):
        email = mock_email_class.return_value
        plan = Plan.objects.create(
            subscription=self.subscription,
            name="Pro Plan",
            start_date=timezone.now().date() - timedelta(days=100),
            end_date=self.makeExpiringDate(),
            last_reminder_at=timezone.now(),
            total_reminders=1,
        )

        create_plans_alert(self.user.id)
        email.send.assert_not_called()

        plan.refresh_from_db()
        plan.last_reminder_at = timezone.now() - timedelta(
            days=ExpiringPlansReminderTest.REMIND_FREQUENCY_DAYS + 1
        )
        plan.save()

        create_plans_alert(self.user.id)
        email.send.assert_called_once()

    @patch("api.tasks.EmailMultiAlternatives")
    def test_remind_until_max_reminders(self, mock_email_class):
        email = mock_email_class.return_value
        plan = Plan.objects.create(
            subscription=self.subscription,
            name="Pro Plan",
            start_date=timezone.now().date() - timedelta(days=100),
            end_date=self.makeExpiringDate(),
            last_reminder_at=timezone.now(),
            total_reminders=0,
        )

        create_plans_alert(self.user.id)
        email.send.assert_not_called()

        for _ in range(ExpiringPlansReminderTest.REMIND_AT_MOST + 2):
            plan.refresh_from_db()
            plan.last_reminder_at = timezone.now() - timedelta(
                days=ExpiringPlansReminderTest.REMIND_FREQUENCY_DAYS + 1
            )
            plan.save()
            create_plans_alert(self.user.id)

        # refresh the plan to get the latest values
        plan.refresh_from_db()

        self.assertEqual(
            email.send.call_count, ExpiringPlansReminderTest.REMIND_AT_MOST
        )
        self.assertEqual(plan.total_reminders, ExpiringPlansReminderTest.REMIND_AT_MOST)

    @patch("api.tasks.EmailMultiAlternatives")
    def test_stop_reminding_when_disabled(self, mock_email_class):
        email = mock_email_class.return_value
        plan = Plan.objects.create(
            subscription=self.subscription,
            name="Pro Plan",
            start_date=timezone.now().date() - timedelta(days=100),
            end_date=self.makeExpiringDate(),
            last_reminder_at=timezone.now(),
            total_reminders=0,
        )

        create_plans_alert(self.user.id)
        email.send.assert_not_called()

        plan.refresh_from_db()
        plan.last_reminder_at = timezone.now() - timedelta(
            days=ExpiringPlansReminderTest.REMIND_FREQUENCY_DAYS + 1
        )
        plan.save()

        create_plans_alert(self.user.id)
        email.send.assert_called_once()

        plan.refresh_from_db()
        plan.last_reminder_at = timezone.now() - timedelta(
            days=ExpiringPlansReminderTest.REMIND_FREQUENCY_DAYS + 1
        )
        plan.save()

        # Disable reminders and try to trigger an alert again
        user_settings = UserSettings.objects.get(user=self.user)
        user_settings.reminders_active = False
        user_settings.save()

        email.send.reset_mock()
        create_plans_alert(self.user.id)
        email.send.assert_not_called()

        plan.refresh_from_db()
        self.assertEqual(plan.total_reminders, 1)

    @patch("api.tasks.EmailMultiAlternatives")
    def test_multiple_plans_grouped_by_subscription(self, mock_email_class):
        email = mock_email_class.return_value
        Plan.objects.bulk_create(
            [
                Plan(
                    subscription=self.subscription,
                    name=f"Plan {i}",
                    start_date=timezone.now().date() - timedelta(days=100),
                    end_date=self.makeExpiringDate(),
                    last_reminder_at=None,
                    total_reminders=0,
                )
                for i in range(1, 4)
            ]
        )

        with patch(
            "api.tasks.render_to_string", return_value="<html>Email</html>"
        ) as render_mock:
            create_plans_alert(self.user.id)

            render_mock.assert_called_once()
            mock_email_class.assert_called_once_with(
                subject="reMind Alert",
                body="Email",
                from_email="info@re.mind",
                to=[self.user.email],
            )

            email.attach_alternative.assert_called_once_with(
                "<html>Email</html>", "text/html"
            )
            email.send.assert_called_once()

        for plan in Plan.objects.all():
            plan.refresh_from_db()
            self.assertEqual(plan.total_reminders, 1)
            self.assertIsNotNone(plan.last_reminder_at)
