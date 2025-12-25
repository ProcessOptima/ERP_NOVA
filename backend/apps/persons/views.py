from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .models import Person, Address
from .serializers import PersonSerializer, AddressSerializer


class PersonViewSet(ModelViewSet):
    """
    CRUD для модели Person.

    Инварианты:
    - Никакой auth-логики во view
    - Никаких cookies / JWT / request.user
    - Явная фиксация IsAuthenticated
    """

    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    permission_classes = [IsAuthenticated]


class AddressViewSet(ModelViewSet):
    """
    CRUD для адресов Person.
    """

    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]
