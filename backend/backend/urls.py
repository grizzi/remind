from api.views import (
    CreateUserView,
    DeleteUserView,
    TokenObtainPairWithUserView,
    TokenRefreshWithUserView,
)
from django.contrib import admin
from django.urls import include, path

# url link endpoints to views
# we keep the auth ursl here
urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/delete/", DeleteUserView.as_view(), name="delete"),
    path("api/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairWithUserView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshWithUserView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),  # URLs for the browsable API
    path("api/", include("api.urls")),  # prepand api to the urls defined in the api App
]
