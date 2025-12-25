"""
Django settings for backend project.
"""

from pathlib import Path
from datetime import timedelta
import os

# =============================================================================
# ENV / MODE
# =============================================================================

ENV = os.getenv("ENV", "dev")  # dev | prod
IS_PROD = ENV == "prod"
DEBUG = not IS_PROD

# =============================================================================
# BASE
# =============================================================================

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv(
    "DJANGO_SECRET_KEY",
    "django-insecure-CHANGE-ME",
)

ALLOWED_HOSTS = [
    "158.160.90.163",
    "localhost",
    "127.0.0.1",
]

# =============================================================================
# JWT COOKIE NAMES — ЕДИНСТВЕННЫЙ ИСТОЧНИК ПРАВДЫ
# =============================================================================

JWT_ACCESS_COOKIE = "__Host-access" if IS_PROD else "access"
JWT_REFRESH_COOKIE = "__Host-refresh" if IS_PROD else "refresh"

JWT_COOKIE_SECURE = IS_PROD
JWT_COOKIE_SAMESITE = "None" if IS_PROD else "Lax"

# =============================================================================
# CORS / CSRF
# =============================================================================

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    "http://158.160.90.163:3000",
    "http://localhost:3000",
]

CSRF_TRUSTED_ORIGINS = [
    "http://158.160.90.163",
    "http://158.160.90.163:3000",
    "http://localhost:3000",
]

# =============================================================================
# APPLICATIONS
# =============================================================================

INSTALLED_APPS = [
    # Django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party
    "corsheaders",
    "rest_framework",

    # Local apps
    "apps.users.apps.UsersConfig",
    "apps.persons.apps.PersonsConfig",
]

# =============================================================================
# MIDDLEWARE
# =============================================================================

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",

    # CORS must be before CommonMiddleware
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",

    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# =============================================================================
# TEMPLATES (нужно для admin)
# =============================================================================

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# =============================================================================
# URL / WSGI
# =============================================================================

ROOT_URLCONF = "core.urls"
WSGI_APPLICATION = "core.wsgi.application"

# =============================================================================
# DATABASE
# =============================================================================

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "processoptima_db",
        "USER": "processoptima_admin",
        "PASSWORD": "jQv0I0JBmQwV7H7i4Q960jyN",
        "HOST": "localhost",
        "PORT": "5432",
    }
}

# =============================================================================
# AUTH
# =============================================================================

AUTH_USER_MODEL = "users.User"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# =============================================================================
# DRF / JWT
# =============================================================================

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "core.authentication.CookieJWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# =============================================================================
# STATIC / I18N
# =============================================================================

STATIC_URL = "/static/"

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
