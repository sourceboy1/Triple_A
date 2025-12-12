from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.utils import timezone
from decimal import Decimal, InvalidOperation
import pytz

# DB function to remove spaces when comparing existing rows
from django.db.models.functions import Replace
from django.db.models import Value

from .models import SecretProduct


@api_view(['GET'])
@permission_classes([IsAdminUser])
def secret_records(request):
    """
    Return products ordered by name and include cleaned_imei (spaces removed)
    so frontend can search reliably.
    """
    qs = SecretProduct.objects.annotate(
        cleaned_imei=Replace('imei_or_serial', Value(' '), Value(''))  # type: ignore
    ).order_by('name').values(
        'id', 'name', 'imei_or_serial', 'cleaned_imei', 'price', 'description', 'is_sold', 'date_sold'
    )
    return Response({"records": list(qs)}, status=status.HTTP_200_OK)


class AddSecretProductView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, format=None):
        data = request.data or {}

        # normalize inputs
        name = (data.get('name') or "").strip()  # trim leading/trailing whitespace
        # remove ALL whitespace characters (spaces, tabs, etc.)
        imei_raw = data.get('imei_or_serial') or ""
        imei_clean = "".join(str(imei_raw).split())  # splits on any whitespace and rejoins

        price_raw = data.get('price')
        description = data.get('description', '')

        if not name or not imei_clean:
            return Response({"error": "Name and IMEI/Serial required"}, status=status.HTTP_400_BAD_REQUEST)

        # DUPLICATE CHECK: compare against cleaned stored IMEI (handles existing DB rows that contain spaces)
        exists = SecretProduct.objects.annotate(
            cleaned=Replace('imei_or_serial', Value(' '), Value('')) # type: ignore
        ).filter(cleaned=imei_clean).exists()

        if exists:
            return Response({"error": "duplicate"}, status=status.HTTP_400_BAD_REQUEST)

        # PRICE handling: allow empty -> 0, validate numeric
        if price_raw in [None, "", " "]:
            price = Decimal("0")
        else:
            try:
                price = Decimal(price_raw)  # type: ignore
            except InvalidOperation:
                return Response({"error": "Price must be a number"}, status=status.HTTP_400_BAD_REQUEST)

        # Save using cleaned IMEI
        sp = SecretProduct.objects.create(
            name=name,
            imei_or_serial=imei_clean,
            price=price,
            description=description,
            is_sold=False
        )

        return Response({"message": "created", "id": sp.id}, status=status.HTTP_201_CREATED)  # type: ignore


@api_view(['POST'])
@permission_classes([IsAdminUser])
def check_imei(request):
    imei_raw = request.data.get("imei_or_serial") or ""
    imei_clean = "".join(str(imei_raw).split())

    if not imei_clean:
        # return exists: False (or error) — here we return exists False so frontend can show 'invalid' or similar
        return Response({"exists": False}, status=status.HTTP_200_OK)

    exists = SecretProduct.objects.annotate(
        cleaned=Replace('imei_or_serial', Value(' '), Value('')) # type: ignore
    ).filter(cleaned=imei_clean).exists()

    return Response({"exists": exists}, status=status.HTTP_200_OK)


class MarkSecretProductSoldView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk, format=None):
        try:
            product = SecretProduct.objects.get(pk=pk)
        except SecretProduct.DoesNotExist:
            return Response({"error": "not_found"}, status=status.HTTP_404_NOT_FOUND)

        lagos_tz = pytz.timezone("Africa/Lagos")
        product.is_sold = True
        product.date_sold = timezone.now().astimezone(lagos_tz)
        product.save()

        return Response({
            "message": "marked_sold",
            "product": {
                "id": product.id,  # type: ignore
                "is_sold": product.is_sold,
                "date_sold": product.date_sold
            }
        }, status=status.HTTP_200_OK)


class UpdateSecretProductView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk, format=None):
        try:
            product = SecretProduct.objects.get(pk=pk)
        except SecretProduct.DoesNotExist:
            return Response({"error": "not_found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data or {}
        name = (data.get('name') or "").strip()
        imei_raw = data.get('imei_or_serial') or ""
        imei_clean = "".join(str(imei_raw).split())
        description = data.get('description', '')
        price_raw = data.get('price')

        if not name or not imei_clean:
            return Response({"error": "Name and IMEI/Serial required"}, status=status.HTTP_400_BAD_REQUEST)

        # Check for duplicates excluding current product
        exists = SecretProduct.objects.annotate(
            cleaned=Replace('imei_or_serial', Value(' '), Value('')) # type: ignore
        ).filter(cleaned=imei_clean).exclude(pk=pk).exists()

        if exists:
            return Response({"error": "duplicate"}, status=status.HTTP_400_BAD_REQUEST)

        # Price validation
        if price_raw in [None, "", " "]:
            price = Decimal("0")
        else:
            try:
                price = Decimal(price_raw) # type: ignore
            except InvalidOperation:
                return Response({"error": "Price must be a number"}, status=status.HTTP_400_BAD_REQUEST)

        # Save updates
        product.name = name
        product.imei_or_serial = imei_clean
        product.description = description
        product.price = price
        product.save()

        return Response({
            "message": "updated",
            "product": {
                "id": product.id, # type: ignore
                "name": product.name,
                "imei_or_serial": product.imei_or_serial,
                "price": product.price,
                "description": product.description
            }
        }, status=status.HTTP_200_OK)
