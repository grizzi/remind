from django.contrib import admin
from django.urls import path, include

# These are views for JWT that are already built in the Django 
# framework. They are based on the AbstractUser of the framework
# and make db lookup for an existing user. When the user exists, 
# they return the corresponding tokens
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from api.views import CreateUserView

# url link endpoints to views
# we keep the auth ursl here
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', CreateUserView.as_view(), name="register"),
    path('api/token/', TokenObtainPairView.as_view(), name="get_token"),
    path('api/token/refresh/', TokenRefreshView.as_view(), name="refresh"),
    path('api-auth/', include("rest_framework.urls")), # URLs for the browsable API
    path('api/', include("api.urls")) # prepand api to the urls defined in the api App
]
