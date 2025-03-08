from django.urls import path
from . import views

urlpatterns = [
    path("subscriptions/", views.SubscriptionsListCreate.as_view()),
    path("subscriptions/<int:pk>/", views.SubscriptionDetails.as_view()),
    path("settings/", views.UserSettingsListCreate.as_view()),
    path("currencies/", views.CurrencyChoicesView.as_view()),
]
