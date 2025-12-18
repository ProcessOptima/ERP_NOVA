from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import PersonViewSet, AddressViewSet

router = DefaultRouter()
router.register(r"persons", PersonViewSet, basename="persons")
router.register(r"addresses", AddressViewSet, basename="addresses")

urlpatterns = [
    path("", include(router.urls)),
]
