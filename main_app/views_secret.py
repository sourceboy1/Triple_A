from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from .models import SecretProduct

@user_passes_test(lambda u: u.is_superuser)
def secret_records(request):
    data = list(SecretProduct.objects.values())
    return JsonResponse({"records": data})
