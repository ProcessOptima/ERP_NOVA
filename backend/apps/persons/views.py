from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Person, Address
from .serializers import PersonSerializer, AddressSerializer


class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all().order_by("-id")
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]


class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.select_related(
        "registration_address", "actual_address"
    ).order_by("-id")
    serializer_class = PersonSerializer
    permission_classes = [IsAuthenticated]
