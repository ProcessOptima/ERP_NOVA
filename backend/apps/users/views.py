from django.conf import settings
from django.contrib.auth import get_user_model

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import UserSerializer
from .auth import CustomTokenObtainPairSerializer

User = get_user_model()


# ===========================================================================================
# LOGIN
# ===========================================================================================

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        jwt_response = super().post(request, *args, **kwargs)

        access = jwt_response.data.get("access")
        refresh = jwt_response.data.get("refresh")

        response = Response({"success": True})

        response.set_cookie(
            settings.JWT_ACCESS_COOKIE,
            access,
            max_age=300,
            httponly=True,
            secure=settings.JWT_COOKIE_SECURE,
            samesite=settings.JWT_COOKIE_SAMESITE,
            path="/",
        )

        response.set_cookie(
            settings.JWT_REFRESH_COOKIE,
            refresh,
            max_age=2592000,
            httponly=True,
            secure=settings.JWT_COOKIE_SECURE,
            samesite=settings.JWT_COOKIE_SAMESITE,
            path="/",
        )

        return response


# ===========================================================================================
# REFRESH
# ===========================================================================================

class RefreshView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get(settings.JWT_REFRESH_COOKIE)

        if not refresh_token:
            return Response({"detail": "No refresh token"}, status=401)

        try:
            refresh = RefreshToken(refresh_token)
            new_access = str(refresh.access_token)
        except Exception:
            return Response({"detail": "Invalid refresh token"}, status=401)

        response = Response({"success": True})

        response.set_cookie(
            settings.JWT_ACCESS_COOKIE,
            new_access,
            max_age=300,
            httponly=True,
            secure=settings.JWT_COOKIE_SECURE,
            samesite=settings.JWT_COOKIE_SAMESITE,
            path="/",
        )

        return response


# ===========================================================================================
# ME
# ===========================================================================================

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


# ===========================================================================================
# USERS CRUD
# ===========================================================================================

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
