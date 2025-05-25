from datetime import datetime, timedelta

from django.test import TestCase

from api.models import Plan, Subscription, User
from api.tasks import created_last_month, expired_last_month, renewed_last_month


class SendMonthlyReportTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="pass"
        )
        self.subscription = Subscription.objects.create(
            user=self.user, title="Test Subscription"
        )

        self.today = datetime.now().date()
        self.last_date_last_month = self.today.replace(day=1) - timedelta(days=1)

    def test_no_plans(self):
        created = created_last_month(self.user.id)
        renewed = renewed_last_month(self.user.id)
        expired = expired_last_month(self.user.id)

        self.assertEqual(created, [])
        self.assertEqual(renewed, [])
        self.assertEqual(expired, [])

    def test_created_plans(self):
        Plan.objects.create(
            name="created_plan",
            subscription=self.subscription,
            start_date=self.last_date_last_month.replace(day=5),
            end_date=self.last_date_last_month.replace(day=15) + timedelta(days=30),
            renewed=False,
        )

        created = created_last_month(self.user.id)
        renewed = renewed_last_month(self.user.id)
        expired = expired_last_month(self.user.id)

        self.assertEqual(len(created), 1)
        self.assertEqual(len(renewed), 0)
        self.assertEqual(len(expired), 0)
        self.assertEqual(created[0].name, "created_plan")

    def test_renewed_plans(self):
        Plan.objects.create(
            name="renewed_plan",
            subscription=self.subscription,
            start_date=self.last_date_last_month.replace(day=5),
            end_date=self.last_date_last_month.replace(day=15) + timedelta(days=30),
            renewed=True,
        )

        created = created_last_month(self.user.id)
        renewed = renewed_last_month(self.user.id)
        expired = expired_last_month(self.user.id)

        self.assertEqual(len(created), 0)
        self.assertEqual(len(renewed), 1)
        self.assertEqual(len(expired), 0)
        self.assertEqual(renewed[0].name, "renewed_plan")

    def test_expired_plans(self):
        Plan.objects.create(
            name="expired_plan",
            subscription=self.subscription,
            start_date=self.last_date_last_month.replace(day=5),
            end_date=self.last_date_last_month.replace(day=15),
            renewed=False,
        )

        created = created_last_month(self.user.id)
        renewed = renewed_last_month(self.user.id)
        expired = expired_last_month(self.user.id)

        self.assertEqual(len(created), 0)
        self.assertEqual(len(renewed), 0)
        self.assertEqual(len(expired), 1)
        self.assertEqual(expired[0].name, "expired_plan")
