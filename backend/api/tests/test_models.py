from api.models import Subscription

from .test_setup import TestAuthSetup

class TestSubscriptionModel(TestAuthSetup):
    def test_subscription_creation(self):
        Subscription.objects.create(
            title="Test Subscription",
            user=self.user
        )
