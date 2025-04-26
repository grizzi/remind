from datetime import timedelta
from copy import deepcopy

from django.test import TestCase
from django.utils import timezone
from parameterized import parameterized

from api.models import Plan, Subscription, User
from api.tasks import renew_plans


class ExpiringPlansReminderTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="pass"
        )
        self.subscription = Subscription.objects.create(user=self.user, title="reMind")

    def makePlan(self, day_offset, duration_days, auto_renew=True):
        start_date = (
            timezone.now().date()
            - timedelta(days=duration_days)
            - timedelta(days=day_offset)
        )
        end_date = timezone.now().date() - timedelta(days=day_offset)

        return Plan.objects.create(
            subscription=self.subscription,
            name="Expiring Plan",
            start_date=start_date,
            end_date=end_date,
            last_reminder_at=None,
            total_reminders=0,
            auto_renew=auto_renew,
        )

    @parameterized.expand([(0, 30), (1, 30), (10, 40), (30, 50)])
    def test_renew_plan_that_autorenews(self, day_offset, duration_days):
        plan = self.makePlan(day_offset, duration_days)
        initial_end_date = deepcopy(plan.end_date)

        renew_plans(self.user.id)
        plan.refresh_from_db()

        # the new start date is the day after the old end date
        self.assertEqual(plan.start_date, initial_end_date + timedelta(days=1))

        # the new end date is the new start date + duration_days
        self.assertEqual(plan.end_date, plan.start_date + timedelta(days=duration_days))

    @parameterized.expand([(-1, 30), (0, 30), (1, 30), (10, 40), (30, 50)])
    def test_renew_plan_that_does_not_auto_renew(self, day_offset, duration_days):
        plan = self.makePlan(day_offset, duration_days, auto_renew=False)
        initial_start_date = deepcopy(plan.start_date)
        initial_end_date = deepcopy(plan.end_date)

        renew_plans(self.user.id)
        plan.refresh_from_db()

        self.assertEqual(plan.start_date, initial_start_date)
        self.assertEqual(plan.end_date, initial_end_date)

    @parameterized.expand([(-1, 30), (-5, 30), (-10, 30)])
    def test_do_not_renew_plan_in_the_future(self, day_offset, duration_days):
        plan = self.makePlan(day_offset, duration_days, auto_renew=True)
        initial_start_date = deepcopy(plan.start_date)
        initial_end_date = deepcopy(plan.end_date)

        renew_plans(self.user.id)
        plan.refresh_from_db()

        self.assertEqual(plan.start_date, initial_start_date)
        self.assertEqual(plan.end_date, initial_end_date)
