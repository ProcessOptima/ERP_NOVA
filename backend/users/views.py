import os
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth import get_user_model

from .serializers import UserSerializer
from .auth import CustomTokenObtainPairSerializer

User = get_user_model()

IS_PROD = os.getenv("ENV") == "prod"  # <-- добавь ENV=prod на сервере

COOKIE_ACCESS = "__Host-access" if IS_PROD else "access"
COOKIE_REFRESH = "__Host-refresh" if IS_PROD else "refresh"

SECURE_FLAG = True if IS_PROD else False
SAMESITE = "None" if IS_PROD else "Lax"


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        access = response.data.get("access")
        refresh = response.data.get("refresh")

        final = Response({"success": True})

        final.set_cookie(
            COOKIE_ACCESS,
            access,
            max_age=300,
            httponly=True,
            secure=SECURE_FLAG,
            samesite=SAMESITE,
            path="/",
        )

        final.set_cookie(
            COOKIE_REFRESH,
            refresh,
            max_age=2592000,
            httponly=True,
            secure=SECURE_FLAG,
            samesite=SAMESITE,
            path="/",
        )

        return final


class RefreshView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get(COOKIE_REFRESH)

        if not refresh_token:
            return Response({"detail": "No refresh token"}, status=401)

        try:
            refresh = RefreshToken(refresh_token)
            new_access = str(refresh.access_token)
        except Exception:
            return Response({"detail": "Invalid refresh"}, status=401)

        response = Response({"success": True})

        response.set_cookie(
            COOKIE_ACCESS,
            new_access,
            max_age=300,
            httponly=True,
            secure=SECURE_FLAG,
            samesite=SAMESITE,
            path="/",
        )

        return response


class MeView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def initial(self, request, *args, **kwargs):
        token = request.COOKIES.get(COOKIE_ACCESS)
        if token:
            request.META["HTTP_AUTHORIZATION"] = f"Bearer {token}"
        return super().initial(request, *args, **kwargs)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def initial(self, request, *args, **kwargs):
        token = request.COOKIES.get(COOKIE_ACCESS)
        if token:
            request.META["HTTP_AUTHORIZATION"] = f"Bearer {token}"
        return super().initial(request, *args, **kwargs)
