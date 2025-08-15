from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.views.generic import TemplateView
import os

urlpatterns = [
    path('admin/', admin.site.urls),

    # API endpoints
    path('api/', include('main_app.urls')),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Serve static files in DEBUG mode
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# React frontend fallback (only if build exists)
index_file_path = os.path.join(settings.FRONTEND_DIR, 'index.html')
if os.path.exists(index_file_path):
    urlpatterns += [
        re_path(r'^(?!api/|admin/|static/|media/|manifest\.json|favicon\.ico).*$', 
                TemplateView.as_view(template_name='index.html'))
    ]
