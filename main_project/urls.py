from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from main_app.views import CustomTokenObtainPairView, CustomTokenRefreshView
from django.http import JsonResponse

def health(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    # Admin and API routes should always come first
    path('admin/', admin.site.urls),
    path('api/', include('main_app.urls')),
    path('health/', health, name='health'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
]

# -----------------------------------------------------------------------------
# Static and Media Files (Serve with WhiteNoise in production)
# -----------------------------------------------------------------------------
# Django's `static()` helper is only for development.
# In production, WhiteNoise (via STATICFILES_STORAGE) handles STATIC_URL.
# Cloudinary (via DEFAULT_FILE_STORAGE) handles MEDIA_URL.

# During DEBUG, Django's static handler would serve them, but we want Whitenoise.
# So remove the `if settings.DEBUG:` around static().
# WhiteNoise automatically serves STATIC_ROOT via STATIC_URL
# Your media will be served by Cloudinary.
# You generally don't need `static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)`
# when using Whitenoise for production and Cloudinary for media.

# If you needed to serve manifest.json directly, it should be served from STATIC_ROOT
# or handled by WhiteNoise.

# Your current manifest.json handling:
# manifest_file = settings.FRONTEND_DIR / "manifest.json"
# if manifest_file.exists():
#     urlpatterns += [
#         path("manifest.json", TemplateView.as_view(template_name="manifest.json")),
#     ]
# This might still cause issues if manifest.json is served as text/html.
# Let WhiteNoise handle it if it's in a STATICFILES_DIRS or STATIC_ROOT,
# or ensure it's copied to your staticfiles and Whitenoise serves it correctly.
# For now, let's remove this specific manifest.json path and rely on WhiteNoise for it.


# -----------------------------------------------------------------------------
# React Fallback (SPA routing) - This MUST be the last pattern
# -----------------------------------------------------------------------------
# This is the catch-all for your React app.
# It tells Django: "If none of the above URL patterns match,
# then assume it's a React route and serve index.html."

# Check if index.html exists in the FRONTEND_DIR
index_file = settings.FRONTEND_DIR / "index.html"
if index_file.exists():
    urlpatterns += [
        re_path(
            r'^(?!api/|admin/|static/|media/|health/).*$', # Exclude known Django/static prefixes
            TemplateView.as_view(template_name='index.html')
        ),
    ]

# If you need to serve media files directly via Django (not Cloudinary),
# you would add this, but ONLY if DEFAULT_FILE_STORAGE is NOT Cloudinary.
# Since you're using Cloudinary, this usually isn't needed for production.
# if settings.DEBUG: # Only for development, not recommended for production
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)