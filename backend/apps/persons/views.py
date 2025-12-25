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
    - Person является владельцем адресов
    """

    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance: Person) -> None:
        """
        Явно удаляем связанные адреса.

        Причина:
        FK направлен Person -> Address,
        поэтому каскад на уровне БД невозможен.
        """

        registration_address = instance.registration_address
        actual_address = instance.actual_address

        # удаляем персону
        instance.delete()

        # удаляем адреса, если были
        if registration_address:
            registration_address.delete()

        if actual_address:
            actual_address.delete()


class AddressViewSet(ModelViewSet):
    """
    CRUD для адресов Person.

    Используется:
    - для отладки
    - для админских операций
    """

    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]
