from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password

from .models import User
from .serializers import UserSerializer


class IsAdmin(permissions.BasePermission):
    """
    Разрешено только пользователям с role='admin'
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.role == "admin")


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("id")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def create(self, request, *args, **kwargs):
        """
        Создание пользователя с хэшированием пароля.
        """
        data = request.data.copy()
        password = data.get("password")

        if password:
            data["password"] = make_password(password)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
