from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from rest_framework import status
from .models import CustomUser, Cart ,CartItem, Category,Payment,PaymentDetail,PaymentMethod,Product,Review,Promotion,ProductPromotion,Order,OrderItem,ShippingAddress,ProductImage
from .serializers import UserSerializer, CartSerializer ,CartItemSerializer,CategorySerializer,PaymentSerializer,PaymentDetailSerializer,PaymentMethodSerializer,ProductSerializer,ReviewSerializer,PromotionSerializer,ProductPromotionSerializer,OrderSerializer,OrderItemSerializer,ShippingAddressSerializer,ProductImageSerializer
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






import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Select 'Deals of the Day' every 7 days"

    def handle(self, *args, **kwargs):
        today = datetime.today()
        seven_days_ago = today - timedelta(days=7)

        # Reset the previous deals
        Product.objects.filter(is_deal_of_the_day=True).update(is_deal_of_the_day=False)

        # Select new random products for deal of the day
        products = Product.objects.filter(created_at__gte=seven_days_ago)

        if products.exists():
            # Select random products as deal of the day (you can change how many are chosen)
            deals_of_the_day = random.sample(list(products), k=min(len(products), 5))  # Change '5' to the number of products you want

            for product in deals_of_the_day:
                product.is_deal_of_the_day = True
                product.save()

        self.stdout.write(self.style.SUCCESS(f"Successfully updated 'Deals of the Day'"))



class DealOfTheDayView(APIView):
    def get(self, request):
        deals = Product.objects.filter(is_deal_of_the_day=True)
        serializer = ProductSerializer(deals, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)





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
            user = serializer.save()  # Save user with address and phone

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
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_id = request.data.get('user_id')
        payment_method_id = request.data.get('payment_method_id')
        
        # Check if user and payment method exist
        user = CustomUser.objects.filter(id=user_id).first()
        payment_method = PaymentMethod.objects.filter(id=payment_method_id).first()

        if not user or not payment_method:
            return Response({'error': 'Invalid user or payment method'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update request data with IDs
        request.data['user_id'] = user.id
        request.data['payment_method_id'] = payment_method.id

        # Serialize the order data
        serializer = OrderSerializer(data=request.data)

        if serializer.is_valid():
            order = serializer.save()

            return Response({
                'message': 'Order placed successfully!',
                'order_id': order.order_id,
                'order': serializer.data
            }, status=status.HTTP_201_CREATED)
        else:
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)








class OrderDetailView(APIView):
    def get(self, request, *args, **kwargs):
        order_id = kwargs.get('order_id')
        try:
            order = Order.objects.get(order_id=order_id)
        except Order.DoesNotExist:
            return Response({'detail': 'Order not found.'}, status=404)

        # Extract the address details
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

        return Response(address_details)








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
                'user_id': user.id,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)




logger = logging.getLogger(__name__)

class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        # Validate current password
        if not user.check_password(current_password):
            return Response({'detail': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        # Update user information
        user.first_name = request.data.get('first_name', user.first_name)
        user.last_name = request.data.get('last_name', user.last_name)
        user.email = request.data.get('email', user.email)

        # Update password if a new one is provided
        if new_password:
            user.set_password(new_password)
            user.save()  # Save user after setting new password

            # Delete old token
            Token.objects.filter(user=user).delete()

            # Create new token
            new_token = Token.objects.create(user=user)
        else:
            new_token = Token.objects.get(user=user)

        update_session_auth_hash(request, user)  # Keep the user logged in with the new password

        response_data = {
            'user_id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'token': new_token.key if new_password else None
        }

        return Response(response_data, status=status.HTTP_200_OK)







class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.all()
        category_id = self.request.query_params.get('category_id', None)
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


    

class PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer

class ProductPromotionViewSet(viewsets.ModelViewSet):
    queryset = ProductPromotion.objects.all()
    serializer_class = ProductPromotionSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status



class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        return Order.objects.filter(user_id=user.id)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        Order = self.get_object()
        if request.user.id != Order.user_id_id:
            return Response({"message": "Not authorized to cancel this order."}, status=status.HTTP_403_FORBIDDEN)
        
        # Logic to cancel the order
        Order.status = 'cancelled'  # Make sure this status matches your model
        Order.save()
        return Response({"message": "Order canceled successfully."}, status=status.HTTP_200_OK)




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


