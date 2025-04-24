from datetime import timedelta
from unittest.mock import patch

from django.test import TestCase
from django.utils import timezone
from loguru import logger

from api.models import Plan, RemindFrequencyChoices, Subscription, User, UserSettings
from api.tasks import create_plans_alert


class ExpiringPlansReminderTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="pass"
        )
        self.settings = UserSettings.objects.create(
            user=self.user,
            reminders_active=True,
            remind_frequency=RemindFrequencyChoices.WEEKLY,
            remind_at_most=3,
            remind_within_days=7,
        )
        self.subscription = Subscription.objects.create(
            user=self.user, title="reMind PRO"
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
            end_date=timezone.now().date() + timedelta(days=3),
            last_reminder_at=None,
            total_reminders=0,
        )

        create_plans_alert(self.user.id)

        email.send.assert_called_once()

        plan.refresh_from_db()
        self.assertEqual(plan.total_reminders, 1)
        self.assertIsNotNone(plan.last_reminder_at)

    # @patch("django.core.mail.EmailMultiAlternatives")
    # def test_does_not_remind_if_plan_is_not_expiring(self, mock_email_class):
    #     email = mock_email_class.return_value
    #     Plan.objects.create(
    #         subscription=self.subscription,
    #         name="Far Future Plan",
    #         end_date=timezone.now().date() + timedelta(days=30),
    #         last_reminder_at=None,
    #         total_reminders=0,
    #     )

    #     create_plans_alert(self.user.id)
    #     email.send.assert_not_called()

    # @patch("django.core.mail.EmailMultiAlternatives")
    # def test_multiple_plans_grouped_by_subscription(self, mock_email_class):
    #     mail = mock_email_class.return_value
    #     Plan.objects.bulk_create(
    #         [
    #             Plan(
    #                 subscription=self.subscription,
    #                 name=f"Plan {i}",
    #                 end_date=timezone.now().date() + timedelta(days=i),
    #                 last_reminder_at=None,
    #                 total_reminders=0,
    #             )
    #             for i in range(1, 4)
    #         ]
    #     )

    #     with patch(
    #         "django.template.loader.render_to_string", return_value="<html>Email</html>"
    #     ) as render_mock:
    #         create_plans_alert(self.user.id)

    #         render_mock.assert_called_once()
    #         mail.assert_called_once_with(
    #             subject="Plans Expiring Soon",
    #             body="Email",
    #             from_email="info@re.mind",
    #             to=[self.user.email],
    #         )
    #         mail.attach_alternative.assert_called_once_with(
    #             "<html>Email</html>", "text/html"
    #         )
    #         mail.send.assert_called_once()

    #     for plan in Plan.objects.all():
    #         plan.refresh_from_db()
    #         self.assertEqual(plan.total_reminders, 1)
    #         self.assertIsNotNone(plan.last_reminder_at)
