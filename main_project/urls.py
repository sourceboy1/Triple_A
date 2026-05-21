from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.generic import TemplateView
from main_app.views import CustomTokenObtainPairView, CustomTokenRefreshView
from django.http import JsonResponse


def health(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('main_app.urls')),
    path('health/', health, name='health'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
]

# ✅ React SPA catch-all — must be last
# Excludes all Django/static/media routes so they are never swallowed by index.html
index_file = settings.FRONTEND_DIR / "index.html"
if index_file.exists():
    urlpatterns += [
        re_path(
            r'^(?!api/|admin/|static/|media/|health/).*$',
            TemplateView.as_view(template_name='index.html'),
        ),
    ]