"""
Django settings for backend project.
"""
from pathlib import Path
from datetime import timedelta
import os

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-8uko+v5#pl==#^_z$j7vt(20g25*o5wic^r500c%-fxi4=zfk1'

DEBUG = True
IS_PROD = not DEBUG

# ===========================================================================================
# HOSTS — обязательно указываем ПУБЛИЧНЫЙ IP, иначе будет ошибка "Invalid HTTP_HOST header"
# ===========================================================================================
ALLOWED_HOSTS = [
    "158.160.90.163",  # фронтенд открывается из Safari на этом IP
    "localhost",
    "127.0.0.1",
]

# ===========================================================================================
# CORS / CSRF — фронт работает на http://158.160.90.163:3000 → нужно явно разрешить
# ===========================================================================================

CORS_ALLOW_CREDENTIALS = True

# Разрешенные origins (фронт)
CORS_ALLOWED_ORIGINS = [
    "http://158.160.90.163:3000",
    "http://localhost:3000",
]

# Доверенные сайты для CSRF
CSRF_TRUSTED_ORIGINS = [
    "http://158.160.90.163",
    "http://158.160.90.163:3000",
    "http://localhost:3000",
]

CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

CORS_ALLOW_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]

# ===========================================================================================
# Custom User
# ===========================================================================================

AUTH_USER_MODEL = "users.User"

# ===========================================================================================
# Installed apps
# ===========================================================================================

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # third-party
    'rest_framework',
    'corsheaders',

    # apps
    'users',
]

# ===========================================================================================
# Middleware — ВАЖНО! CORS идет ПЕРЕД CommonMiddleware
# ===========================================================================================

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',

    'corsheaders.middleware.CorsMiddleware',  # <---- ОБЯЗАТЕЛЬНО ВВЕРХУ
    'django.middleware.common.CommonMiddleware',

    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ===========================================================================================
# URL / Templates / WSGI
# ===========================================================================================

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# ===========================================================================================
# Database (оставляем как есть)
# ===========================================================================================

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'processoptima_db',
        'USER': 'processoptima_admin',
        'PASSWORD': 'jQv0I0JBmQwV7H7i4Q960jyN',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# ===========================================================================================
# Passwords
# ===========================================================================================

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ===========================================================================================
# Localization
# ===========================================================================================

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ===========================================================================================
# Static
# ===========================================================================================

STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ===========================================================================================
# DRF + JWT
# ===========================================================================================

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ]
}

SIMPLE_JWT = {
    "AUTH_HEADER_TYPES": ("Bearer",),
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
}
