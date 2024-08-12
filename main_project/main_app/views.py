from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework import status
from .models import users, cart ,CartItem, Category,Payment,PaymentDetail,PaymentMethod,Product,Review,Promotion,ProductPromotion,Order,OrderItem,ShippingAddress,ProductImage
from .serializers import UserSerializer, CartSerializer ,CartItemSerializer,CategorySerializer,PaymentSerializer,PaymentDetailSerializer,PaymentMethodSerializer,ProductSerializer,ReviewSerializer,PromotionSerializer,ProductPromotionSerializer,OrderSerializer,OrderItemSerializer,ShippingAddressSerializer,ProductImageSerializer,ProductImageUploadSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from django.contrib.auth import authenticate, login as auth_login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from .models import User
import json  
import logging
from django.core.mail import send_mail
from rest_framework.views import APIView
from django.conf import settings
import random
import string
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser



class ProductImageUploadView(APIView):
    def post(self, request, format=None):
        serializer = ProductImageSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def upload_image(request):
    serializer = ProductImageUploadSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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



class PasswordResetView(APIView):
    def post(self, request, uid, token):
        new_password = request.data.get('new_password')
        if not new_password:
            return Response({'error': 'New password is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(pk=uid)
            # Ensure the token matches
            if user.profile.reset_token != token:
                return Response({'error': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(new_password)
            user.profile.reset_token = ''  # Clear the token after successful password reset
            user.profile.save()
            user.save()

            return Response({'message': 'Password has been reset successfully.'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Invalid user ID.'}, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'No user with this email address.'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate a unique token or code for password reset
        token = ''.join(random.choices(string.ascii_letters + string.digits, k=20))

        # Save the token to the user's profile or somewhere secure
        # user.profile.reset_token = token
        # user.profile.save()

        # Send email with reset link
        reset_link = f"{settings.FRONTEND_URL}/reset-password/{user.pk}/{token}/"
        send_mail(
            'Password Reset Request',
            f'Click the link to reset your password: {reset_link}',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )

        return Response({'message': 'Password reset link sent to your email.'}, status=status.HTTP_200_OK)

logger = logging.getLogger(__name__)

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        logger.info(f"Login attempt with username: {username}")

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'username': user.username,
                'email': user.email,
            })
        else:
            logger.warning(f"Failed login attempt with username: {username}")
            return Response({'error': 'Incorrect username or password'}, status=status.HTTP_401_UNAUTHORIZED)


@csrf_exempt
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)
        user = User.objects.create_user(username=username, password=password)
        return JsonResponse({'message': 'User registered successfully'}, status=201)
    return JsonResponse({'error': 'Invalid method'}, status=400)


@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try:
            # Parse JSON data from the request body
            data = json.loads(request.body)
            
            # Extract fields from the request data
            username = data.get('username')
            password = data.get('password')
            email = data.get('email')
            first_name = data.get('firstName', '')
            last_name = data.get('lastName', '')
            address = data.get('address', '')
            phone = data.get('phone', '')

            # Validate required fields
            if not username or not password or not email:
                return JsonResponse({'error': 'Username, email, and password are required.'}, status=400)
            
            # Check if username or email already exists
            if users.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Username already exists.'}, status=400)
            
            if users.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email address already registered.'}, status=400)

            # Create and save the new user
            new_user = users(
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name,
                address=address,
                phone=phone,
                password=make_password(password)  # Hash the password
            )
            new_user.save()

            return JsonResponse({'message': 'User created successfully!'}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method. Use POST.'}, status=405)

class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.all()
        category_name = self.request.query_params.get('category', None)
        if category_name:
            queryset = queryset.filter(category__name__iexact=category_name)
        return queryset


class YourModelViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    
class UserViewSet(viewsets.ModelViewSet):
    queryset = users.objects.all()
    serializer_class = UserSerializer

class CartViewSet(viewsets.ModelViewSet):
    queryset = cart.objects.all()
    serializer_class = CartSerializer

class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class PaymentDetailViewSet(viewsets.ModelViewSet):
    queryset = PaymentDetail.objects.all()
    serializer_class = PaymentDetailSerializer

class PaymentMethodViewSet(viewsets.ModelViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    

class PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer

class ProductPromotionViewSet(viewsets.ModelViewSet):
    queryset = ProductPromotion.objects.all()
    serializer_class = ProductPromotionSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

class ShippingAddressViewSet(viewsets.ModelViewSet):
    queryset = ShippingAddress.objects.all()
    serializer_class = ShippingAddressSerializer
