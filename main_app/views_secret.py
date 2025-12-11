# main_app/views_secret.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.db import transaction
from django.utils import timezone
import pytz
from decimal import Decimal, InvalidOperation



from .models import SecretProduct

@api_view(['GET'])
@permission_classes([IsAdminUser])
def secret_records(request):
    qs = SecretProduct.objects.all().values()
    return Response({"records": list(qs)}, status=status.HTTP_200_OK)


class AddSecretProductView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, format=None):
        data = request.data or {}
        name = data.get('name')
        imei_or_serial = data.get('imei_or_serial')
        price_raw = data.get('price')
        description = data.get('description', '')

        if not name or not imei_or_serial:
            return Response({"error": "Name and IMEI/Serial required"}, status=status.HTTP_400_BAD_REQUEST)

        # --- FIX STARTS HERE ---
        # If price is empty, set it to 0
        if price_raw in [None, "", " "]:
            price = Decimal("0")
        else:
            try:
                price = Decimal(price_raw) # type: ignore
            except InvalidOperation:
                return Response({"error": "Price must be a number"}, status=status.HTTP_400_BAD_REQUEST)
        # --- FIX ENDS HERE ---

        sp = SecretProduct.objects.create(
            name=name,
            imei_or_serial=imei_or_serial,
            price=price,
            description=description,
            is_sold=False
        )

        return Response({"message": "created", "id": sp.id}, status=status.HTTP_201_CREATED) # type: ignore


class MarkSecretProductSoldView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk, format=None):
        try:
            product = SecretProduct.objects.get(pk=pk)
        except SecretProduct.DoesNotExist:
            return Response({"error": "not_found"}, status=status.HTTP_404_NOT_FOUND)

        # Lagos timezone
        lagos_tz = pytz.timezone("Africa/Lagos")
        product.is_sold = True
        product.date_sold = timezone.now().astimezone(lagos_tz)
        product.save()

        return Response({
            "message": "marked_sold",
            "product": {
                "id": product.id, # type: ignore
                "is_sold": product.is_sold,
                "date_sold": product.date_sold
            }
        }, status=status.HTTP_200_OK)
