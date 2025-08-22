from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

# API & admin
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('main_app.urls')),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Serve media
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Serve static in DEBUG
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Serve manifest.json
manifest_file = settings.FRONTEND_DIR / "manifest.json"
if manifest_file.exists():
    urlpatterns += [
        path("manifest.json", TemplateView.as_view(template_name="manifest.json")),
    ]

# React fallback
index_file = settings.FRONTEND_DIR / "index.html"
if index_file.exists():
    urlpatterns += [
        re_path(r'^(?!api/|admin/|static/|media/|manifest\.json).*$', 
                TemplateView.as_view(template_name='index.html'))
    ]
