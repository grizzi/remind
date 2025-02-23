from django.contrib.auth.models import User
from rest_framework import serializers
# from .models import Note

# We do not have to define the user model oursleves, 
# this common definition is already provided by django
# framework for us

# The ModelSerializer class provides a shortcut 
# that lets you automatically create a Serializer class with fields that correspond to the Model fields.
# See https://www.django-rest-framework.org/api-guide/serializers/#modelserializer
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
    
# class NoteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Note
#         fields = ["id", "title", "content", "created_at", "author"]
        
#         # In this case we want to only be able to read this property
#         # when I am signed id, I am of course the author of this 
#         # entry. We want therefore to disallow to write it freely, but to 
#         # allow to only read this property. This property is instead written
#         # by the backend. These read_only/write_only entail what the 
#         # frontend can do
#         extra_kwargs = {"author": {"read_only": True}}