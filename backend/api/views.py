from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from .serializers import UserSerializer, SubscriptionSerializer
from .models import Subscription

class SubscriptionsListCreate(generics.ListCreateAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # We implement here a dedicated queryset, since we 
        # want to access the request object to be able to filter
        # the data by the currently logged in user
        user = self.request.user
        return Subscription.objects.filter(user=user)
    
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)
    
class SubscriptionDelete(generics.DestroyAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Subscription.objects.filter(user=user)
           
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
