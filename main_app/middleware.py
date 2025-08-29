from django.conf import settings
from django.shortcuts import redirect

class MaintenanceModeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if getattr(settings, "MAINTENANCE_MODE", False):
            # ✅ Always allow admin site
            if request.path.startswith("/admin"):
                return self.get_response(request)

            # ✅ Allow staff/admin users to bypass AND auto-redirect away from /maintenance
            if request.user.is_authenticated and request.user.is_staff:
                if request.path.startswith("/maintenance"):
                    return redirect("/")  # send staff back to homepage/dashboard
                return self.get_response(request)

            # ✅ Normal users: redirect everything to /maintenance
            if not request.path.startswith("/maintenance"):
                return redirect("/maintenance")

        return self.get_response(request)
