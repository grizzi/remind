from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Subscription, UserSettings


from loguru import logger

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"] # include only these fields
        
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
    
class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = "__all__"
        
    
        # In this case we want to only be able to read this property
        # when I am signed id, I am of course the author of this 
        # entry. We want therefore to disallow to write it freely, but to 
        # allow to only read this property. This property is instead written
        # by the backend. These read_only/write_only entail what the 
        # frontend can do
        extra_kwargs = {"user": {"read_only": True}}

class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = "__all__"
        
        extra_kwargs = {"user": {"read_only": True}}
  