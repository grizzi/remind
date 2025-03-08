from django.http import Http404
from django.contrib.auth.models import User
from djmoney.settings import CURRENCY_CHOICES

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
    
    
    # def post(self, request, *args, **kwargs):
    #     print("Post method reached!")  # Debugging output
    #     print("Request Data:", request.data)  # Log incoming data
    
    #     serializer = self.get_serializer(data=request.data)
    #     if not serializer.is_valid():
    #         print("Serializer Errors:", serializer.errors)  # 🔍 Print validation errors
    #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    #     serializer.save(user=self.request.user)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def create(self, request, *args, **kwargs):
        logger.info(f"Received data: {request.data}")

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Validation failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(user=self.request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
# class SubscriptionDetails(generics.RetrieveUpdateDestroyAPIView):
#     serializer_class = SubscriptionSerializer
#     permission_classes = [IsAuthenticated]
    
#     # Had our url been path('subscription/<int:pk>/'), 
#     # i.e used keyword argument id ('subscription/<int:id>/') instead of pk then we would 
#     # need to specify lookup_url_kwarg like
#     # lookup_url_kwarg = 'id'
#     def get_queryset(self):
#         return Subscription.objects.filter(user=self.request.user)

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
        snippet = self.get_object(pk)
        serializer = SubscriptionSerializer(snippet)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        snippet = self.get_object(pk)
        serializer = SubscriptionSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        logger.error(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
           
class UserSettingsListCreate(generics.ListCreateAPIView):
    serializer_class = UserSettingsSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserSettings.objects.filter(user=self.request.user)
    
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
