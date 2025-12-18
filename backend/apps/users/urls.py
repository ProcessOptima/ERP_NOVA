# backend/users/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import LoginView, MeView, RefreshView, UserViewSet

router = DefaultRouter()
router.register("users", UserViewSet, basename="users")

urlpatterns = [
    # AUTH
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/me/", MeView.as_view(), name="me"),
    path("auth/refresh/", RefreshView.as_view(), name="token_refresh"),

    # USERS CRUD: /api/users/, /api/users/{id}/
    path("", include(router.urls)),
]
