from django.db import transaction
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Subscription, UserSettings, Label, Plan

from loguru import logger


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "username", "password"]  # include only these fields

        # we want to tell Django to return (serialize) the user withouth
        # the password and instead write the user (deserialize from the frontend)
        # with the password. The password, from the Django perspective is then
        # a write only field
        extra_kwargs = {"password": {"write_only": True}}

    # See https://www.django-rest-framework.org/api-guide/serializers/#saving-instances
    # If we want to be able to return complete object instances based on the validated data
    # we need to implement one or both of the .create() and .update() methods.
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserSettingsSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserSettings
        fields = "__all__"

        extra_kwargs = {"user": {"read_only": True}}


class LabelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Label
        fields = ['name', 'subscription']

        extra_kwargs = {"user": {"read_only": True}}


class PlanSerializer(serializers.ModelSerializer):

    class Meta:
        model = Plan
        fields = "__all__"

        extra_kwargs = {"user": {"read_only": True}}


class SubscriptionSerializer(serializers.ModelSerializer):
    labels = LabelSerializer(many=True)

    class Meta:
        model = Subscription
        fields = "__all__"
        extra_fields = ["labels"]

        # In this case we want to only be able to read this property
        # when I am signed id, I am of course the author of this
        # entry. We want therefore to disallow to write it freely, but to
        # allow to only read this property. This property is instead written
        # by the backend. These read_only/write_only entail what the
        # frontend can do
        extra_kwargs = {"user": {"read_only": True}}

    def create(self, validated_data):
        labels_data = validated_data.pop("labels", [])

        # Ensures all database operations succeed or fail together
        with transaction.atomic():
            subscription = Subscription.objects.create(**validated_data)
            for label_data in labels_data:
                Label.objects.create(subscription=subscription, **label_data)

        return subscription

    def update(self, instance, validated_data):
        labels_data = validated_data.pop("labels",
                                         [])  # Get nested labels data

        # Ensures all database operations succeed or fail together
        with transaction.atomic():

            # Update subscription fields
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

            self._create_or_update_labels(all_labels=instance.labels.all(),
                                          labels_data=labels_data,
                                          user=instance.user)

        return instance

    def _create_or_update_labels(self,
                                 all_labels: list[Label],
                                 labels_data: dict,
                                 user=User()):
        """
        If label already was attached to this subscription, update it, 
        otherwise create a new one
        """
        existing_labels = {label.id: label for label in all_labels}

        for label_data in labels_data:
            label_id = label_data.get("id", None)

            if label_id and label_id in existing_labels:
                label = existing_labels[label_id]
                for key, value in label_data.items():
                    setattr(label, key, value)
                label.save()
                existing_labels.pop(
                    label_id)  # Remove from dict to track remaining ones
            else:
                logger.info(f"Creating new label: {label_data}")
                Label.objects.create(user=user, **label_data)

        # Delete labels that were removed
        for label in existing_labels.values():
            label.delete()
