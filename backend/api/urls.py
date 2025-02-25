from django.urls import path
from . import views

urlpatterns = [
    path("subscriptions/", views.SubscriptionsListCreate.as_view()),
    path("subscriptions/delete/<int:pk>", views.SubscriptionDelete.as_view())
]
