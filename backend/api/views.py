from django.http import Http404
from django.contrib.auth.models import User
from djmoney.settings import CURRENCY_CHOICES
from django.db.models.signals import post_save
from django.dispatch import receiver

from rest_framework import generics, views
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from .serializers import UserSerializer, SubscriptionSerializer, UserSettingsSerializer
from .models import Subscription, UserSettings

from loguru import logger


class CurrencyChoicesView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        _ = request
        currencies = [{
            "code": code,
            "name": name
        } for code, name in CURRENCY_CHOICES]
        return Response(currencies)


class SubscriptionsListCreate(generics.ListCreateAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # We implement here a dedicated queryset, since we
        # want to access the request object to be able to filter
        # the data by the currently logged in user
        user = self.request.user
        return Subscription.objects.filter(user=user)

    def create(self, request, *args, **kwargs):
        logger.info(f"Received data: {request.data}")

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Validation failed: {serializer.errors}")
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

        serializer.save(user=self.request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SubscriptionDetails(views.APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Subscription.objects.filter(user=self.request.user).get(
                pk=pk)
        except Subscription.DoesNotExist:
            logger.error(
                f"Subscription {pk} for user {self.request.user} not found")
            raise Http404

    def get(self, request, pk, format=None):
        _ = request, format
        subscription = self.get_object(pk)
        serializer = SubscriptionSerializer(subscription)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        _ = format
        subscription = self.get_object(pk)
        # here the serializer is initialized with the instance
        # and the data that we want to update
        serializer = SubscriptionSerializer(subscription, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        logger.error(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        _ = request, format
        self.get_object(pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserSettingsDetails(views.APIView):
    serializer_class = UserSettingsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserSettings.objects.filter(user=self.request.user)

    def get(self, request, format=None):
        settings = self.get_queryset().first()
        serializer = UserSettingsSerializer(settings)
        logger.info(f"Returning settings: {serializer.data}")
        return Response(serializer.data)

    def put(self, request, format=None):
        settings = self.get_queryset().first()
        serializer = UserSettingsSerializer(settings, data=request.data)
        if serializer.is_valid():
            serializer.save(user=self.request.user)
            return Response(serializer.data)
        logger.error(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)


class CreateUserView(views.APIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        
        logger.error(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@receiver(post_save, sender=User)
def create_user_picks(sender, instance, created, **kwargs):
    if created:
        UserSettings.objects.create(user=instance)
        