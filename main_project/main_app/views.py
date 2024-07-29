from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import users, cart ,CartItem, Category,Payment,PaymentDetail,PaymentMethod,Product,Review,Promotion,ProductPromotion,Order,OrderItem,ShippingAddress
from .serializers import UserSerializer, CartSerializer ,CartItemSerializer,CategorySerializer,PaymentSerializer,PaymentDetailSerializer,PaymentMethodSerializer,ProductSerializer,ReviewSerializer,PromotionSerializer,ProductPromotionSerializer,OrderSerializer,OrderItemSerializer,ShippingAddressSerializer
from rest_framework.permissions import IsAuthenticated


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
