import json

from django.contrib.auth.models import User
from django.db import transaction
from django.http import Http404
from django_celery_beat.models import IntervalSchedule, PeriodicTask
from django_filters.rest_framework import DjangoFilterBackend
from djmoney.settings import CURRENCY_CHOICES
from loguru import logger
from rest_framework import generics, status, views
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import Label, Plan, Subscription, UserSettings
from .serializers import (
    LabelSerializer,
    PlanSerializer,
    SubscriptionSerializer,
    TokenObtainPairWithUserSerializer,
    TokenRefreshWithUserSerializer,
    UserSerializer,
    UserSettingsSerializer,
)
from .tasks import send_welcome_email


class CurrencyChoicesView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        _ = request
        currencies = [{"code": code, "name": name} for code, name in CURRENCY_CHOICES]
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

        # Handle labels differently
        labels_data = request.data.pop("labels", [])
        request.data["labels"] = []

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Validation failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        subscription = serializer.save(user=request.user)

        # Now create the label objects and associate them with the new subscription
        for label in labels_data:
            Label.objects.create(
                name=label["name"], user=request.user, subscription=subscription
            )

        # Re-serialize to include the created labels in the response
        output_serializer = self.get_serializer(subscription)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)


class SubscriptionDetails(views.APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Subscription.objects.filter(user=self.request.user).get(pk=pk)
        except Subscription.DoesNotExist:
            logger.error(f"Subscription {pk} for user {self.request.user} not found")
            raise Http404

    def get(self, request, pk, format=None):
        _ = request, format
        subscription = self.get_object(pk)
        serializer = SubscriptionSerializer(subscription)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = SubscriptionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        logger.error(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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


class PlanListCreate(generics.ListCreateAPIView):
    serializer_class = PlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        subscription_id = self.kwargs["subscription_id"]
        return Plan.objects.filter(subscription=subscription_id)

    def create(self, request, *args, **kwargs):
        logger.info(f"Received data: {request.data}")

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Got data: {request.data}")
            logger.error(f"Validation failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PlanDetails(views.APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, subscription_id):
        try:
            return Plan.objects.filter(subscription=subscription_id).get(pk=pk)
        except Subscription.DoesNotExist:
            logger.error(f"Plan {pk} for user {self.request.user} not found")
            raise Http404

    def get(self, request, subscription_id, pk, format=None):
        _ = request, format
        plan = self.get_object(pk, subscription_id)
        serializer = PlanSerializer(plan)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = PlanSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        logger.error(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, subscription_id, format=None):
        _ = format
        plan = self.get_object(pk, subscription_id)
        logger.info(f"{request.data}")
        serializer = PlanSerializer(plan, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        logger.error(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, subscription_id, format=None):
        _ = request, format
        logger.info(f"Deleting plan {pk}")
        self.get_object(pk, subscription_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserSettingsDetails(views.APIView):
    serializer_class = UserSettingsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserSettings.objects.filter(user=self.request.user)

    def get(self, request, format=None):
        settings = self.get_queryset().first()
        serializer = UserSettingsSerializer(settings)
        return Response(serializer.data)

    def put(self, request, format=None):
        settings = self.get_queryset().first()
        serializer = UserSettingsSerializer(settings, data=request.data)
        if serializer.is_valid():
            serializer.save(user=self.request.user)
            return Response(serializer.data)
        logger.error(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateUserView(views.APIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        try:
            with transaction.atomic():
                user: User = None
                serializer = UserSerializer(data=request.data)

                if serializer.is_valid():
                    user = serializer.save()
                else:
                    logger.error(serializer.errors)
                    raise NameError("A user with that username already exists")

                # Create default user settings
                logger.info("Creating user settings")
                user_settings = UserSettings.objects.create(user=user)

                # Send welcome email
                logger.info("Sending welcome email")
                send_welcome_email.delay(user.username, user.email)

                # Create monitoring task
                logger.info("Creating monitoring task")
                schedule, _ = IntervalSchedule.objects.get_or_create(
                    every=1,
                    period=IntervalSchedule.HOURS,
                )

                logger.info("Creating periodic task for this user")
                task = PeriodicTask.objects.create(
                    interval=schedule,
                    name=f"user_{user.id}_monitor",
                    task="api.tasks.user_monitor",
                    args=json.dumps(
                        [
                            user.id,
                        ]
                    ),
                )
                user_settings.task = task
                logger.info("Saving user settings")
                user_settings.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as exc:
            return Response(str(exc), status=status.HTTP_400_BAD_REQUEST)


class DeleteUserView(generics.DestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """Return the authenticated user instead of querying by ID"""
        return self.request.user

    def destroy(self, request, *args, **kwargs):
        _ = request, args, kwargs
        user = self.get_object()
        user.delete()
        return Response(
            {"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT
        )


class LabelsList(generics.ListCreateAPIView):
    serializer_class = LabelSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["subscription"]

    def get_queryset(self):
        return Label.objects.filter(user=self.request.user)

    def put(self, request, *args, **kwargs):
        data = request.data

        if not isinstance(data, list):
            return Response(
                {"error": "Expected a list of objects"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Fetch existing labels
        existing_labels = {label.id: label for label in self.get_queryset()}
        updated_labels = []

        for item in data:
            label_id = item.get("id")
            if label_id and label_id in existing_labels:
                # Update existing label
                label_instance = existing_labels[label_id]
                serializer = LabelSerializer(label_instance, data=item, partial=True)
            else:
                # Create new label
                serializer = LabelSerializer(data=item)

            if serializer.is_valid():
                updated_labels.append(serializer.save(user=self.request.user))
            else:
                logger.error(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(LabelSerializer(updated_labels, many=True).data)


class TokenObtainPairWithUserView(TokenObtainPairView):
    serializer_class = TokenObtainPairWithUserSerializer


class TokenRefreshWithUserView(TokenRefreshView):
    serializer_class = TokenRefreshWithUserSerializer
