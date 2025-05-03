import uuid
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User


class TestAuthSetup(TestCase):
    def setUp(self):
        self.client = APIClient()
        username = str(uuid.uuid4())
        fake_email = f"{username}@email.com"
        self.user = User.objects.create(username=username, email=fake_email)

        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {str(refresh.access_token)}"
        )
