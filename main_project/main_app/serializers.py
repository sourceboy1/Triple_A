from rest_framework import serializers
from .models import CustomUser, Cart, CartItem, Category, Payment,PaymentDetail,PaymentMethod,Product,Review,ProductPromotion,Promotion,Order,OrderItem,ShippingAddress, ProductImage
from django.contrib.auth import get_user_model


CustomUser = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)  # Add password field

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'first_name', 'last_name', 'address', 'phone', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password', None)  # Extract password
        user = CustomUser(**validated_data)
        if password:
            user.set_password(password)  # Hash the password
        user.save()
        return user
    


class CartSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nested serializer

    class Meta:
        model = Cart
        fields = ['cart_id', 'user', 'created_at']

class CartItemSerializer(serializers.ModelSerializer):
    cart = CartSerializer()

    class Meta:
        model = CartItem
        fields = ['cart_item_id', 'cart', 'product_id', 'quantity']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [ 'name']

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['payment_id', 'order_id', 'payment_method_id', 'amount', 'payment_date', 'status']

class PaymentDetailSerializer(serializers.ModelSerializer):
    payment = PaymentSerializer()

    class Meta:
        model = PaymentDetail
        fields = ['payment_detail_id', 'payment', 'transaction_id', 'amount', 'status', 'details']



class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    secondary_image_url = serializers.SerializerMethodField()
    tertiary_image_url = serializers.SerializerMethodField()
    quaternary_image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = [
            'id', 'image_url', 'secondary_image_url', 
            'tertiary_image_url', 'quaternary_image_url', 
            'description'
        ]

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_secondary_image_url(self, obj):
        request = self.context.get('request')
        if obj.secondary_image:
            return request.build_absolute_uri(obj.secondary_image.url)
        return None

    def get_tertiary_image_url(self, obj):
        request = self.context.get('request')
        if obj.tertiary_image:
            return request.build_absolute_uri(obj.tertiary_image.url)
        return None

    def get_quaternary_image_url(self, obj):
        request = self.context.get('request')
        if obj.quaternary_image:
            return request.build_absolute_uri(obj.quaternary_image.url)
        return None

    
    

class ProductSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    additional_images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'product_id', 'name', 'description', 'price', 'original_price', 
            'discount', 'stock', 'category', 'category_name', 'image_url', 
            'additional_images', 'created_at'
        ]

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None









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
    class Meta:
        model = Order
        fields = '__all__'


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ['payment_method_id', 'user', 'method_name', 'created_at']

    
    

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    order = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all())

    class Meta:
        model = OrderItem
        fields = ['order_item_id', 'order', 'product', 'quantity', 'price']

class ShippingAddressSerializer(serializers.ModelSerializer):
    # Use PrimaryKeyRelatedField for user to accept user ID
    user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), required=False)

    class Meta:
        model = ShippingAddress
        fields = ['id', 'user', 'address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country', 'created_at']

    def create(self, validated_data):
        user = self.context['request'].user  # Get the logged-in user
        validated_data['user'] = user
        return super().create(validated_data)
