from rest_framework import serializers
from .models import users, cart, CartItem, Category, Payment,PaymentDetail,PaymentMethod,Product,Review,ProductPromotion,Promotion,Order,OrderItem,ShippingAddress

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = users
        fields = ['user_id', 'username', 'email', 'first_name', 'last_name', 'address', 'phone', 'created_at']

class CartSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nested serializer

    class Meta:
        model = cart
        fields = ['cart_id', 'user', 'created_at']

class CartItemSerializer(serializers.ModelSerializer):
    cart = CartSerializer()

    class Meta:
        model = CartItem
        fields = ['cart_item_id', 'cart', 'product_id', 'quantity']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category_id', 'name', 'description', 'created_at']

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['payment_id', 'order_id', 'payment_method_id', 'amount', 'payment_date', 'status']

class PaymentDetailSerializer(serializers.ModelSerializer):
    payment = PaymentSerializer()

    class Meta:
        model = PaymentDetail
        fields = ['payment_detail_id', 'payment', 'transaction_id', 'amount', 'status', 'details']

class PaymentMethodSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = PaymentMethod
        fields = ['payment_method_id', 'user', 'method_name', 'details', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer()

    class Meta:
        model = Product
        fields = ['product_id', 'name', 'description', 'price', 'stock', 'category', 'image_url', 'created_at']

class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = ['promotion_id', 'code', 'description', 'discount_type', 'discount_value', 'start_date', 'end_date', 'usage_limit', 'usage_count', 'status', 'created_at']

class ProductPromotionSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    promotion = PromotionSerializer()

    class Meta:
        model = ProductPromotion
        fields = ['product_promotion_id', 'product', 'promotion', 'discount_value']

class ReviewSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    user = UserSerializer()

    class Meta:
        model = Review
        fields = ['review_id', 'product', 'user', 'rating', 'comment', 'created_at']

class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Order
        fields = ['order_id', 'user', 'total', 'status', 'created_at']

class OrderItemSerializer(serializers.ModelSerializer):
    order = OrderSerializer()
    product = ProductSerializer()

    class Meta:
        model = OrderItem
        fields = ['order_item_id', 'order', 'product', 'quantity', 'price']
class ShippingAddressSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = ShippingAddress
        fields = ['id', 'user', 'address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country', 'created_at']
