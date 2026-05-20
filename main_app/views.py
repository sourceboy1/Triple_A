import random
import threading
import logging
import traceback

from django.shortcuts import get_object_or_404, render
from django.contrib.auth import authenticate, update_session_auth_hash, get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.management.base import BaseCommand
from django.http import JsonResponse
from django.db.models import Q
from django.conf import settings
from django.views import View

from rest_framework import viewsets, permissions, generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

import requests

from .models import (
    CustomUser, Cart, CartItem, Category,
    Payment, PaymentDetail, PaymentMethod,
    Product, Order, OrderItem,
    ShippingAddress, ProductImage,
)
from .serializers import (
    UserSerializer, CartSerializer, CartItemSerializer,
    CategorySerializer, PaymentSerializer, PaymentDetailSerializer,
    PaymentMethodSerializer, ProductSerializer,
    OrderSerializer, OrderItemSerializer,
    ShippingAddressSerializer, ProductImageSerializer,
    CustomTokenObtainPairSerializer,
)
from .utils.email_helpers import (
    validate_signed_token,
    format_price,
    generate_signed_link,
    send_order_email as sync_send_order_email,
    send_password_reset_email,
)

CustomUser = get_user_model()
logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────

def index(request):
    return render(request, 'index.html')


def async_send_order_email(to_email, order, request=None):
    """Fire-and-forget order confirmation email in a background thread."""
    def task():
        try:
            sync_send_order_email(to_email, order, request=request)
            logger.info("[ASYNC] Order confirmation email sent to %s", to_email)
        except Exception as e:
            logger.exception("[ASYNC] Failed to send order email to %s: %s", to_email, e)

    threading.Thread(target=task, daemon=True).start()


# ─────────────────────────────────────────────────────────────
# MANAGEMENT COMMAND  (belongs in management/commands/ but kept here)
# ─────────────────────────────────────────────────────────────

class Command(BaseCommand):
    help = "Select 'Deals of the Day' every 7 days"

    def handle(self, *args, **kwargs):
        Product.objects.filter(is_deal_of_the_day=True).update(is_deal_of_the_day=False)

        products = Product.objects.all()
        if products.exists():
            deals = random.sample(list(products), k=min(len(products), 5))
            for product in deals:
                product.is_deal_of_the_day = True
                product.save()
            self.stdout.write(self.style.SUCCESS("Successfully updated 'Deals of the Day'"))
        else:
            self.stdout.write(self.style.WARNING("No products available to set as deals."))


# ─────────────────────────────────────────────────────────────
# AUTH — SIGNUP / LOGIN / PROFILE
# ─────────────────────────────────────────────────────────────

class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username   = request.data.get('username')
        email      = request.data.get('email')
        first_name = request.data.get('first_name')
        last_name  = request.data.get('last_name')
        password   = request.data.get('password')
        address    = request.data.get('address', '')
        phone      = request.data.get('phone', '')

        if CustomUser.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserSerializer(data={
            'username': username, 'email': email,
            'first_name': first_name, 'last_name': last_name,
            'password': password, 'address': address, 'phone': phone,
        })

        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user) # type: ignore
            return Response({
                "message": "User created successfully",
                "access":    str(refresh.access_token),
                "refresh":   str(refresh),
                "user_id":   user.id, # type: ignore
                "username":  user.username, # type: ignore
            }, status=status.HTTP_201_CREATED)

        logger.error("Signup serializer errors: %s", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        identifier = request.data.get('username')
        password   = request.data.get('password')

        if not identifier or not password:
            return Response(
                {'error': 'Username/Email and password are required'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if '@' in identifier:
            try:
                user_obj = CustomUser.objects.get(email=identifier)
                user = authenticate(username=user_obj.username, password=password)
            except CustomUser.DoesNotExist:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            user = authenticate(username=identifier, password=password)

        if user is None:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access':  str(refresh.access_token),
            'user': {
                'id':           user.id, # type: ignore
                'username':     user.username,
                'first_name':   user.first_name,
                'last_name':    user.last_name,
                'email':        user.email,
                'is_superuser': user.is_superuser,
                'is_staff':     user.is_staff,
            },
        }, status=status.HTTP_200_OK)


class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user             = request.user
        current_password = request.data.get('current_password')
        new_password     = request.data.get('new_password')

        if not current_password:
            return Response(
                {'detail': 'Current password is required to update profile'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not user.check_password(current_password):
            return Response(
                {'detail': 'Current password is incorrect'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.first_name = request.data.get('first_name', user.first_name)
        user.last_name  = request.data.get('last_name',  user.last_name)
        user.address    = request.data.get('address',    user.address)
        user.phone      = request.data.get('phone',      user.phone)

        new_email = request.data.get('email')
        if new_email and new_email != user.email:
            if CustomUser.objects.filter(email=new_email).exclude(id=user.id).exists():
                return Response(
                    {'detail': 'This email is already in use'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            user.email = new_email

        if new_password:
            user.set_password(new_password)

        user.save()

        new_tokens = None
        if new_password:
            refresh = RefreshToken.for_user(user)
            new_tokens = {'refresh': str(refresh), 'access': str(refresh.access_token)}

        return Response({
            'user_id':    user.id,
            'username':   user.username,
            'first_name': user.first_name,
            'last_name':  user.last_name,
            'email':      user.email,
            'address':    user.address,
            'phone':      user.phone,
            'tokens':     new_tokens,
        }, status=status.HTTP_200_OK)


# ─────────────────────────────────────────────────────────────
# AUTH — PASSWORD RESET
# ─────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
    if not CustomUser.objects.filter(email=email).exists():
        return Response({'error': 'Email is not registered'}, status=status.HTTP_400_BAD_REQUEST)

    user       = CustomUser.objects.get(email=email)
    token      = default_token_generator.make_token(user)
    reset_link = f"http://localhost:3000/reset-password/{user.pk}/{token}"
    send_password_reset_email(user, reset_link)
    return Response({'message': 'Password reset link sent'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    uid      = request.data.get('uid')
    token    = request.data.get('token')
    password = request.data.get('password')

    if not uid or not token or not password:
        return Response({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = CustomUser.objects.get(pk=uid)
        if default_token_generator.check_token(user, token):
            user.set_password(password)
            user.save()
            return Response({'message': 'Password has been reset successfully!'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid token or token has expired.'}, status=status.HTTP_400_BAD_REQUEST)
    except CustomUser.DoesNotExist:
        return Response({'error': 'Invalid UID.'}, status=status.HTTP_400_BAD_REQUEST)


# ─────────────────────────────────────────────────────────────
# TOKEN VIEWS
# ─────────────────────────────────────────────────────────────

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = TokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return Response({"detail": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

        access        = serializer.validated_data["access"]
        user_id       = AccessToken(access)["user_id"]
        User          = get_user_model()

        try:
            user      = User.objects.get(id=user_id)
            user_data = UserSerializer(user).data
        except User.DoesNotExist:
            user_data = None

        return Response({"access": access, "user": user_data})


# ─────────────────────────────────────────────────────────────
# PRODUCTS
# ─────────────────────────────────────────────────────────────

@api_view(['GET'])
def product_list(request):
    queryset      = Product.objects.all()
    query         = request.GET.get('query')
    category_name = request.GET.get('category')

    if query:
        queryset = queryset.filter(
            Q(name__icontains=query) | Q(description__icontains=query)
        )
    if category_name and category_name != 'All':
        queryset = queryset.filter(category__name__iexact=category_name)

    serializer = ProductSerializer(queryset, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def product_detail_view(request, product_id):
    try:
        product    = Product.objects.get(pk=product_id)
        serializer = ProductSerializer(product, context={'request': request})
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


class ProductDetailView(generics.RetrieveAPIView):
    queryset           = Product.objects.all()
    serializer_class   = ProductSerializer


class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset    = Product.objects.all()
        category_id = self.request.query_params.get('category_id') # type: ignore
        if category_id:
            try:
                queryset = queryset.filter(category_id=int(category_id))
            except (ValueError, TypeError):
                return Product.objects.none()
        return queryset


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset               = Product.objects.prefetch_related('additional_images').all()
    serializer_class       = ProductSerializer
    permission_classes     = [AllowAny]
    authentication_classes = []
    lookup_field           = 'pk'

    def get_queryset(self):
        queryset    = super().get_queryset()
        category_id = self.request.query_params.get('category_id')
        category    = self.request.query_params.get('category')
        query       = self.request.query_params.get('query')

        if category_id:
            try:
                queryset = queryset.filter(category_id=int(category_id))
            except (ValueError, TypeError):
                return queryset.none()
        elif category:
            if category.isdigit():
                queryset = queryset.filter(category_id=int(category))
            else:
                queryset = queryset.filter(category__slug=category)

        if query:
            queryset = queryset.filter(name__icontains=query)

        return queryset

    def retrieve(self, request, *args, **kwargs):
        lookup   = kwargs.get('pk')
        instance = None
        try:
            if str(lookup).isdigit():
                instance = get_object_or_404(Product, product_id=int(lookup)) # type: ignore
            else:
                instance = get_object_or_404(Product, slug=lookup)
        except Exception:
            instance = get_object_or_404(Product, pk=lookup)

        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def products_suggestions(request):
    query = request.GET.get('query', '').strip()
    if not query:
        return JsonResponse([], safe=False)

    try:
        suggestions_qs = (
            Product.objects
            .filter(Q(name__icontains=query) | Q(category__name__icontains=query))
            .select_related('category')
            .prefetch_related('additional_images')
            .distinct()[:10]
        )

        results = []
        for product in suggestions_qs:
            image_url = None

            # Primary image
            try:
                if product.image:
                    image_url = request.build_absolute_uri(product.image.url)
            except Exception:
                pass

            # Fallback to first additional image
            if not image_url:
                try:
                    first = product.additional_images.first() # type: ignore
                    if first and first.image:
                        image_url = request.build_absolute_uri(first.image.url)
                except Exception:
                    pass

            # Final fallback
            if not image_url:
                image_url = request.build_absolute_uri('/static/no-image.png')

            category = getattr(product, 'category', None)
            results.append({
                'id':            getattr(product, 'product_id', getattr(product, 'id', None)),
                'name':          product.name,
                'category_id':   getattr(category, 'id', None) if category else None,
                'category_name': category.name if category else 'N/A',
                'image_urls':    {'large': image_url},
            })

        return JsonResponse(results, safe=False)

    except Exception:
        traceback.print_exc()
        return JsonResponse([], safe=False)


# ─────────────────────────────────────────────────────────────
# DEALS OF THE DAY
# ─────────────────────────────────────────────────────────────

class DealOfTheDayView(APIView):
    authentication_classes = []
    permission_classes     = [AllowAny]

    def get(self, request):
        deals = Product.objects.filter(is_deal_of_the_day=True)

        if not deals.exists():
            all_products = Product.objects.all()
            if all_products.exists():
                random_product = random.choice(list(all_products))
                random_product.is_deal_of_the_day = True
                random_product.save()
                deals = Product.objects.filter(is_deal_of_the_day=True)

        serializer = ProductSerializer(deals, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


# ─────────────────────────────────────────────────────────────
# ORDERS
# ─────────────────────────────────────────────────────────────

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class   = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user_id=self.request.user.id) # type: ignore

    def perform_create(self, serializer):
        order = serializer.save()
        try:
            user_email = getattr(getattr(order, 'user_id', None), 'email', None)
            if user_email:
                async_send_order_email(user_email, order, request=self.request)
                logger.info("Queued order confirmation email to %s", user_email)
            else:
                logger.warning("Order %s has no user email", getattr(order, 'order_id', 'unknown'))
        except Exception as e:
            logger.exception("Failed to queue order email: %s", e)

    @action(detail=True, methods=['get'], url_path='view',
            authentication_classes=[], permission_classes=[])
    def view_signed(self, request, pk=None):
        """Public token-based view. Requires ?token=<signed_token>."""
        token = request.query_params.get('token')
        if not token:
            return Response({'error': 'Missing token'}, status=status.HTTP_400_BAD_REQUEST)

        order_order_id = validate_signed_token(token)
        if not order_order_id:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_403_FORBIDDEN)

        order      = get_object_or_404(Order, order_id=order_order_id)
        serializer = self.get_serializer(order)
        return Response({'order': serializer.data}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='cancel',
            authentication_classes=[], permission_classes=[])
    def cancel_signed(self, request, pk=None):
        """Token-based cancel (no login required). Requires ?token=<signed_token>."""
        token = request.query_params.get('token')
        if not token:
            return Response({'error': 'Missing token'}, status=status.HTTP_400_BAD_REQUEST)

        order_order_id = validate_signed_token(token)
        if not order_order_id:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_403_FORBIDDEN)

        order = get_object_or_404(Order, order_id=order_order_id)
        if order.status in ['cancelled', 'delivered']:
            return Response({'error': 'Order cannot be cancelled.'}, status=status.HTTP_400_BAD_REQUEST)

        order.status = 'cancelled'
        order.save()
        return Response({'message': f'Order #{order.order_id} has been cancelled.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='cancel-auth')
    def cancel_auth(self, request, pk=None):
        """JWT-authenticated cancel. Called as POST /api/orders/<id>/cancel-auth/"""
        order = self.get_object()

        if order.user_id_id != request.user.id:
            return Response({'error': 'Not authorized to cancel this order.'}, status=status.HTTP_403_FORBIDDEN)

        if order.status.lower() in ['cancelled', 'delivered', 'shipped']:
            return Response(
                {'error': f'Order cannot be cancelled — current status is "{order.status}".'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.status = 'cancelled'
        order.save()
        return Response({'message': f'Order #{order.order_id} has been successfully cancelled.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def confirm_payment(self, request, pk=None):
        order = self.get_object()

        if request.user.id != order.user_id_id:
            return Response({'error': 'Not authorized to confirm payment for this order.'}, status=status.HTTP_403_FORBIDDEN)

        data            = request.data
        reference       = data.get('transaction_reference') or data.get('reference') or data.get('transactionReference')
        amount_paid     = data.get('amount_paid')
        shipping_method = data.get('shipping_method') or order.shipping_method

        if not reference:
            return Response({'error': 'transaction_reference is required.'}, status=status.HTTP_400_BAD_REQUEST)

        paystack_key = getattr(settings, 'PAYSTACK_SECRET_KEY', None)
        if not paystack_key:
            logger.error("PAYSTACK_SECRET_KEY not configured in settings.")
            return Response({'error': 'Paystack secret key is not configured on server.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        verify_url = f"https://api.paystack.co/transaction/verify/{reference}"
        try:
            headers   = {"Authorization": f"Bearer {paystack_key}", "Accept": "application/json"}
            resp      = requests.get(verify_url, headers=headers, timeout=15)
            resp_json = resp.json()
        except requests.RequestException as e:
            logger.exception("Error contacting Paystack for verification")
            return Response({'error': 'Failed to reach Paystack for verification.', 'details': str(e)}, status=status.HTTP_502_BAD_GATEWAY)

        if resp.status_code != 200 or not resp_json.get('status'):
            message = resp_json.get('message', 'Failed to verify transaction with Paystack.')
            logger.warning("Paystack verification failed: %s", resp_json)
            return Response({'error': 'Paystack verification failed.', 'message': message, 'paystack': resp_json}, status=status.HTTP_400_BAD_REQUEST)

        paystack_data        = resp_json.get('data', {})
        paystack_status      = paystack_data.get('status')
        paystack_amount_kobo = paystack_data.get('amount')

        if paystack_status != 'success':
            return Response({'error': 'Payment not successful according to Paystack.', 'paystack_status': paystack_status}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if amount_paid is not None:
                posted_kobo = int(round(float(amount_paid)))
                if posted_kobo != int(paystack_amount_kobo):
                    logger.warning("Amount mismatch for order %s: posted %s vs paystack %s kobo", order.order_id, posted_kobo, paystack_amount_kobo)
                    return Response({'error': 'Paid amount mismatch.', 'expected_kobo': posted_kobo, 'paystack_amount_kobo': paystack_amount_kobo}, status=status.HTTP_400_BAD_REQUEST)
            else:
                expected_kobo = int(round(float(order.total_amount) * 100))
                if int(paystack_amount_kobo) != expected_kobo:
                    logger.warning("Amount mismatch for order %s: expected %s vs paystack %s kobo", order.order_id, expected_kobo, paystack_amount_kobo)
                    return Response({'error': 'Paid amount does not match order total.', 'order_expected_kobo': expected_kobo, 'paystack_amount_kobo': paystack_amount_kobo}, status=status.HTTP_400_BAD_REQUEST)
        except (ValueError, TypeError):
            logger.exception("Invalid amount_paid value: %s", amount_paid)
            return Response({'error': 'Invalid amount_paid value sent.'}, status=status.HTTP_400_BAD_REQUEST)

        order.transaction_reference = reference
        order.payment_confirmed     = True
        order.save()

        if shipping_method:
            is_pickup = 'pick' in shipping_method.lower()
        else:
            try:
                is_pickup = float(order.shipping_cost) == 0.0
            except Exception:
                is_pickup = False

        success_message = (
            "Your payment was verified. Your order will be ready for pickup soon."
            if is_pickup else
            "Your payment was verified. Your order will be processed and shipped soon."
        )

        return Response({
            'status':                'success',
            'verified':              True,
            'payment_confirmed':     order.payment_confirmed,
            'transaction_reference': order.transaction_reference,
            'success_message':       success_message,
            'paystack_data':         paystack_data,
        }, status=status.HTTP_200_OK)


class PlaceOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user              = request.user
        payment_method_id = request.data.get('payment_method_id')

        if not payment_method_id:
            return Response({'error': 'payment_method_id is required'}, status=400)
        if not PaymentMethod.objects.filter(id=payment_method_id).exists():
            return Response({'error': 'Invalid payment method'}, status=400)

        data                    = request.data.copy()
        data['user_id']         = user.id
        data['payment_method_id'] = payment_method_id

        serializer = OrderSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            order = serializer.save()
            try:
                user_email = getattr(getattr(order, 'user_id', None), 'email', None)
                if user_email:
                    async_send_order_email(user_email, order, request=request)
                    logger.info("Queued order confirmation email to %s", user_email)
                else:
                    logger.warning("Order %s has no user email.", order.order_id) # type: ignore
            except Exception as e:
                logger.error("Failed to queue order email: %s", e)

            order_data = OrderSerializer(order, context={'request': request}).data
            return Response({'message': 'Order placed successfully!', 'order_id': order.order_id, 'order': order_data}, status=201) # type: ignore

        return Response(serializer.errors, status=400)


class UserOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders     = Order.objects.filter(user_id=request.user.id)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ─────────────────────────────────────────────────────────────
# SIMPLE VIEWSETS
# ─────────────────────────────────────────────────────────────

class UserViewSet(viewsets.ModelViewSet):
    queryset         = CustomUser.objects.all()
    serializer_class = UserSerializer

class CartViewSet(viewsets.ModelViewSet):
    queryset         = Cart.objects.all()
    serializer_class = CartSerializer

class CartItemViewSet(viewsets.ModelViewSet):
    queryset         = CartItem.objects.all()
    serializer_class = CartItemSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset         = Category.objects.all()
    serializer_class = CategorySerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset         = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer

    def create(self, request, *args, **kwargs):
        method_name = request.data.get('method_name')
        if method_name:
            try:
                payment_method       = PaymentMethod.objects.get(method_name=method_name)
                request.data['method_name'] = payment_method.id # type: ignore
            except PaymentMethod.DoesNotExist:
                return Response({"error": "Invalid payment method."}, status=400)
        return super().create(request, *args, **kwargs)

class PaymentDetailViewSet(viewsets.ModelViewSet):
    queryset         = PaymentDetail.objects.all()
    serializer_class = PaymentDetailSerializer

class PaymentMethodViewSet(viewsets.ModelViewSet):
    queryset         = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset         = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

class ShippingAddressViewSet(viewsets.ModelViewSet):
    queryset           = ShippingAddress.objects.all()
    serializer_class   = ShippingAddressSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)