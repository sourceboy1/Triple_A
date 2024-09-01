from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework import status
from .models import CustomUser, Cart ,CartItem, Category,Payment,PaymentDetail,PaymentMethod,Product,Review,Promotion,ProductPromotion,Order,OrderItem,ShippingAddress,ProductImage
from .serializers import UserSerializer, CartSerializer ,CartItemSerializer,CategorySerializer,PaymentSerializer,PaymentDetailSerializer,PaymentMethodSerializer,ProductSerializer,ReviewSerializer,PromotionSerializer,ProductPromotionSerializer,OrderSerializer,OrderItemSerializer,ShippingAddressSerializer,ProductImageSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
import json  
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
from django.contrib.auth.hashers import make_password
import logging
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404




CustomUser = get_user_model()

@api_view(['POST'])
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

        # Check if username or email already exists
        if CustomUser.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

        # Use the serializer to create the user
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            # Create the user using the custom manager
            user = CustomUser.objects.create_user(
                username=username,
                email=email,
                password=password,  # `create_user` handles hashing
                first_name=first_name,
                last_name=last_name
            )

            # Generate an authentication token for the new user
            token, _ = Token.objects.get_or_create(user=user)

            return Response({
                "message": "User created successfully",
                "token": token.key,
                "user_id": user.id,
                "username": user.username
            }, status=status.HTTP_201_CREATED)
        
        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    

    
class PlaceOrderView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Your order placement logic here
        return Response({'message': 'Order placed successfully!'}, status=status.HTTP_200_OK)



logger = logging.getLogger(__name__)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        identifier = request.data.get('username')
        password = request.data.get('password')

        if not identifier or not password:
            return Response({'error': 'Username/Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        user = None
        if '@' in identifier:
            try:
                user = CustomUser.objects.get(email=identifier)
                user = authenticate(username=user.username, password=password)
            except CustomUser.DoesNotExist:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            user = authenticate(username=identifier, password=password)

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.pk,
                'username': user.username
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)



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
                request.data['method_name'] = payment_method.id
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
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Product.objects.all()
        query = self.request.query_params.get('query', None)
        if query:
            # Filter products where name contains the search query (case-insensitive)
            queryset = queryset.filter(name__icontains=query)
        return queryset
    

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


class OrderCreateView(APIView):
    def post(self, request):
        user_id = request.data.get('user')
        payment_method_id = request.data.get('payment_method')

        # Check if user and payment method exist
        user = CustomUser.objects.filter(id=user_id).first()
        payment_method = PaymentMethod.objects.filter(payment_method_id=payment_method_id).first()

        if not user or not payment_method:
            return Response({'error': 'Invalid user or payment method'}, status=status.HTTP_400_BAD_REQUEST)

        # Update the request data with IDs
        request.data['user_id'] = user.id
        request.data['payment_method'] = payment_method.payment_method_id

        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




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


