# backend/core/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

    # ВСЕ API идут через /api/
    path("api/", include("apps.users.urls")),
    path("api/", include("apps.persons.urls")),
]
