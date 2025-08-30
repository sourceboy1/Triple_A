from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import TokenRefreshView  # keep only refresh
from main_app.views import CustomTokenObtainPairView, CustomTokenRefreshView  # ✅ import both
from django.http import JsonResponse  # ✅ import for health check

# ✅ Simple health check view
def health(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('main_app.urls')),

    # ✅ Health check endpoint
    path('health/', health, name='health'),

    # ✅ Use custom JWT login
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
]

# Media
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Static (only in DEBUG)
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Manifest
manifest_file = settings.FRONTEND_DIR / "manifest.json"
if manifest_file.exists():
    urlpatterns += [
        path("manifest.json", TemplateView.as_view(template_name="manifest.json")),
    ]

# React fallback
index_file = settings.FRONTEND_DIR / "index.html"
if index_file.exists():
    urlpatterns += [
        re_path(
            r'^(?!api/|admin/|static/|media/|manifest\.json).*$', 
            TemplateView.as_view(template_name='index.html')
        )
    ]
