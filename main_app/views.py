from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework import status
from .models import CustomUser, Cart, CartItem, Category, Payment, PaymentDetail, PaymentMethod, Product, Order, OrderItem, ShippingAddress, ProductImage
from .serializers import UserSerializer, CartSerializer, CartItemSerializer, CategorySerializer, PaymentSerializer, PaymentDetailSerializer, PaymentMethodSerializer, ProductSerializer, OrderSerializer, OrderItemSerializer, ShippingAddressSerializer, ProductImageSerializer, CustomTokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.contrib.auth import update_session_auth_hash 
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from django.core.mail import send_mail
from rest_framework.views import APIView
from django.conf import settings
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.views import View
from django.db.models import Q
import logging
from django.contrib.auth import get_user_model
import logging
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

def index(request):
    return render(request, 'index.html')


import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Select 'Deals of the Day' every 7 days"

    def handle(self, *args, **kwargs):
        # Reset previous deals
        Product.objects.filter(is_deal_of_the_day=True).update(is_deal_of_the_day=False)

        # Get all products (instead of only recent ones)
        products = Product.objects.all()

        if products.exists():
            # Pick up to 5 random products as deals
            deals_of_the_day = random.sample(list(products), k=min(len(products), 5))

            for product in deals_of_the_day:
                product.is_deal_of_the_day = True
                product.save()

            self.stdout.write(
                self.style.SUCCESS(f"Successfully updated 'Deals of the Day'")
            )
        else:
            self.stdout.write(
                self.style.WARNING("No products available to set as deals.")
            )

# API View
class DealOfTheDayView(APIView):
    authentication_classes = []  # ✅ No authentication required
    permission_classes = [AllowAny]

    def get(self, request):
        deals = Product.objects.filter(is_deal_of_the_day=True)

        # Ensure fallback: if no deals, pick a random one
        if not deals.exists():
            all_products = Product.objects.all()
            if all_products.exists():
                random_product = random.choice(list(all_products))
                random_product.is_deal_of_the_day = True
                random_product.save()
                deals = Product.objects.filter(is_deal_of_the_day=True)

        serializer = ProductSerializer(deals, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)




CustomUser = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])  # ✅ Allow requests without authentication
def request_password_reset(request):
    email = request.data.get('email')
    
    if not CustomUser.objects.filter(email=email).exists():
        return Response({'error': 'Email is not registered'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = CustomUser.objects.get(email=email)
    
    # Generate token
    token = default_token_generator.make_token(user)
    
    # Generate reset link
    reset_link = f"http://localhost:3000/reset-password/{user.pk}/{token}"
    
    # Send reset email
    send_mail(
        'Password Reset Request',
        f'Please use the following link to reset your password: {reset_link}',
        'no-reply@yourdomain.com',
        [email],
        fail_silently=False,
    )
    
    return Response({'message': 'Password reset link sent'}, status=status.HTTP_200_OK)



@api_view(['POST'])
def reset_password(request):
    uid = request.data.get('uid')
    token = request.data.get('token')
    password = request.data.get('password')
    
    try:
        user = CustomUser.objects.get(pk=uid)
        if default_token_generator.check_token(user, token):
            user.set_password(password)
            user.save()
            return Response({'message': 'Password has been reset successfully!'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid token or token has expired.'}, status=status.HTTP_400_BAD_REQUEST)
    except CustomUser.DoesNotExist:
        return Response({'error': 'Invalid UID.'}, status=status.HTTP_400_BAD_REQUEST)





def product_suggestions(request):
    query = request.GET.get('query', '')
    if query:
        suggestions = Product.objects.filter(name__icontains=query)[:5]
        data = [{'id': product.id, 'name': product.name} for product in suggestions]
        return JsonResponse(data, safe=False)
    return JsonResponse([], safe=False)

def search_products(query):
    return Product.objects.filter(
        Q(name__icontains=query) | 
        Q(description__icontains=query) |
        Q(category__name__icontains=query)
    )





@api_view(['GET'])
def product_detail_view(request, product_id):
    try:
        product = Product.objects.get(pk=product_id)
        serializer = ProductSerializer(product, context={'request': request})
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


@api_view(['GET'])
def product_list(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True, context={'request': request})
    return Response(serializer.data)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CustomTokenRefreshView(TokenRefreshView):
    """
    Extend refresh view to also return user details.
    """
    serializer_class = TokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return Response({"detail": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

        access = serializer.validated_data["access"]

        # Decode the access token to get user_id
        access_token_obj = AccessToken(access)
        user_id = access_token_obj["user_id"]

        User = get_user_model()
        try:
            user = User.objects.get(id=user_id)
            user_data = UserSerializer(user).data
        except User.DoesNotExist:
            user_data = None

        return Response({
            "access": access,
            "user": user_data
        })


CustomUser = get_user_model()  # This will fetch the CustomUser model

logger = logging.getLogger(__name__)

class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        password = request.data.get('password')
        address = request.data.get('address', '')
        phone = request.data.get('phone', '')

        # Check if username or email already exists
        if CustomUser.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

        # Use the serializer to create the user
        serializer = UserSerializer(data={
            'username': username,
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
            'password': password,
            'address': address,
            'phone': phone
        })

        if serializer.is_valid():
            user: CustomUser = serializer.save()  # type: ignore # Save user

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return Response({
                "message": "User created successfully",
                "access": access_token,
                "refresh": str(refresh),
                "user_id": user.id,  # type: ignore
                "username": user.username  # type: ignore
            }, status=status.HTTP_201_CREATED)
        
        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    

    
class PlaceOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        payment_method_id = request.data.get('payment_method_id')

        # Always use the authenticated user
        user = request.user
        payment_method = PaymentMethod.objects.filter(id=payment_method_id).first()

        if not payment_method:
            return Response({'error': 'Invalid payment method'}, status=400)

        data = request.data.copy()
        data['user_id'] = user.id  # ✅ force bind to logged-in user
        data['payment_method_id'] = payment_method.id # type: ignore

        serializer = OrderSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            order = serializer.save(user=user)  # ✅ create order + items

            # 🔑 Re-serialize using the created instance
            order_data = OrderSerializer(order, context={'request': request}).data

            return Response({
                'message': 'Order placed successfully!',
                'order_id': order.order_id, # type: ignore
                'order': order_data
            }, status=201)

        return Response(serializer.errors, status=400)










class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        identifier = request.data.get('username')
        password = request.data.get('password')

        if not identifier or not password:
            return Response(
                {'error': 'Username/Email and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = None
        if '@' in identifier:
            try:
                user_obj = CustomUser.objects.get(email=identifier)
                user = authenticate(username=user_obj.username, password=password)
            except CustomUser.DoesNotExist:
                return Response(
                    {'error': 'Invalid credentials'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        else:
            user = authenticate(username=identifier, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id, # type: ignore
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )




logger = logging.getLogger(__name__)

class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user

        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        # ✅ Require current password for ALL updates
        if not current_password:
            return Response(
                {'detail': 'Current password is required to update profile'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(current_password):
            return Response(
                {'detail': 'Current password is incorrect'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Update profile fields
        user.first_name = request.data.get('first_name', user.first_name)
        user.last_name = request.data.get('last_name', user.last_name)
        user.address = request.data.get('address', user.address)
        user.phone = request.data.get('phone', user.phone)

        # ✅ Handle email update (must be unique)
        new_email = request.data.get('email')
        if new_email and new_email != user.email:
            if CustomUser.objects.filter(email=new_email).exclude(id=user.id).exists():
                return Response(
                    {'detail': 'This email is already in use'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.email = new_email

        # ✅ Handle password update
        if new_password:
            user.set_password(new_password)

        user.save()

        # ✅ Issue new tokens if password changed
        new_tokens = None
        if new_password:
            refresh = RefreshToken.for_user(user)
            new_tokens = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }

        response_data = {
            'user_id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'address': user.address,
            'phone': user.phone,
            'tokens': new_tokens,
        }

        return Response(response_data, status=status.HTTP_200_OK)


            






class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.all()
        category_id = self.request.query_params.get('category_id', None) # type: ignore
        if category_id:
            queryset = queryset.filter(category__id=category_id)
        return queryset



    
class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer

    def create(self, request, *args, **kwargs):
        method_name = request.data.get('method_name')
        if method_name:
            try:
                payment_method = PaymentMethod.objects.get(method_name=method_name)
                request.data['method_name'] = payment_method.id # type: ignore
            except PaymentMethod.DoesNotExist:
                return Response({"error": "Invalid payment method."}, status=400)
        return super().create(request, *args, **kwargs)
    

class PaymentDetailViewSet(viewsets.ModelViewSet):
    queryset = PaymentDetail.objects.all()
    serializer_class = PaymentDetailSerializer

class PaymentMethodViewSet(viewsets.ModelViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer



class ProductViewSet(viewsets.ModelViewSet):
    authentication_classes = [] 
    queryset = Product.objects.all()  # Ensure queryset is defined
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Get the category_id from query parameters
        category_id = self.request.query_params.get('category_id', None)
        if category_id:
            # Filter the products based on category_id
            queryset = queryset.filter(category_id=category_id)
        
        # Optional: add search functionality
        query = self.request.query_params.get('query', None)
        if query:
            queryset = queryset.filter(name__icontains=query)
        
        return queryset



from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status



from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order
from .serializers import OrderSerializer

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # ✅ Users only see their own orders
        user = self.request.user
        return Order.objects.filter(user_id=user.id) # type: ignore

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if request.user.id != order.user_id_id:
            return Response(
                {"message": "Not authorized to cancel this order."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        order.status = 'cancelled'
        order.save()
        return Response(
            {"message": "Order canceled successfully."},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['get'])
    def details(self, request, pk=None):
        """
        ✅ Custom endpoint: GET /orders/<id>/details/
        Returns full order info + shipping address fields.
        """
        order = self.get_object()
        serializer = self.get_serializer(order)

        address_details = {
            'first_name': order.first_name,
            'last_name': order.last_name,
            'address': order.address,
            'city': order.city,
            'state': order.state,
            'postal_code': order.postal_code,
            'country': order.country,
            'phone': order.phone,
        }

        return Response({
            "order": serializer.data,
            "shipping_address": address_details
        }, status=status.HTTP_200_OK)




class UserOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        orders = Order.objects.filter(user_id=user.id)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)






class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer


    
def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    if serializer.is_valid():
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ShippingAddressViewSet(viewsets.ModelViewSet):
    queryset = ShippingAddress.objects.all()
    serializer_class = ShippingAddressSerializer
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can access

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


