from api.models import Subscription, UserSettings

from .test_setup import TestAuthSetup


class TestUserCreation(TestAuthSetup):
    def test_settings_creation(self):
        UserSettings.objects.create(user=self.user)


class TestSubscriptionModel(TestAuthSetup):
    def test_subscription_creation(self):
        Subscription.objects.create(title="Test Subscription", user=self.user)


class TestUserSettingsModel(TestAuthSetup):
    def test_settings_creation(self):
        UserSettings.objects.create(user=self.user)
