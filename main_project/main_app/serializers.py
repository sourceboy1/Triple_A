from rest_framework import serializers
from .models import CustomUser, Cart, CartItem, Category, Payment,PaymentDetail,PaymentMethod,Product,Review,ProductPromotion,Promotion,Order,OrderItem,ShippingAddress, ProductImage
from django.contrib.auth import get_user_model
from django.utils import timezone


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'first_name', 'last_name', 'address', 'phone', 'password']
        extra_kwargs = {
            'username': {'required': False},
        }

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        password = validated_data.get('password')
        if password:
            instance.set_password(password)
        instance.save()
        return instance

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = CustomUser.objects.create(**validated_data)
        if password:
            user.set_password(password)
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
    image_url = serializers.SerializerMethodField()  # Dynamically get image URL
    secondary_image_url = serializers.SerializerMethodField()  # Dynamically get secondary image URL
    category_id = serializers.IntegerField(source='category.id', read_only=True)  # Get category ID
    additional_images = ProductImageSerializer(many=True, read_only=True)  # Assuming additional images are linked to Product

    class Meta:
        model = Product
        fields = [
            'product_id', 'name', 'description', 'price', 'original_price',
            'discount', 'stock', 'category', 'category_id', 'image_url',
            'secondary_image_url', 'additional_images', 'created_at'
        ]

    # Method to get the full image URL
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

    # Method to get the secondary image URL
    def get_secondary_image_url(self, obj):
        request = self.context.get('request')
        # Assuming `additional_images` is linked correctly, and the secondary image is stored there
        first_additional_image = obj.additional_images.first()  # Get the first additional image (can adjust this logic as needed)
        if first_additional_image and first_additional_image.secondary_image:
            return request.build_absolute_uri(first_additional_image.secondary_image.url)
        return None



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category_id', 'name']


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

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['product', 'product_name', 'product_image', 'quantity', 'price']

    def get_product_image(self, obj):
        request = self.context.get('request')
        if obj.product.image:
            return request.build_absolute_uri(obj.product.image.url)
        return None

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = ['address', 'city', 'state', 'postal_code', 'country']



class OrderSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    payment_method_id = serializers.PrimaryKeyRelatedField(
        queryset=PaymentMethod.objects.all(),
    )
    cart_items = OrderItemSerializer(many=True)
    
    
    class Meta:
        model = Order
        fields = [
            'order_id', 'user_id', 'email', 'total_amount', 'created_at',
            'first_name', 'last_name', 'address', 'city', 'state', 'postal_code',
            'country', 'phone', 'shipping_method', 'order_note', 'payment_method_id',
            'shipping_cost', 'status', 'cart_items'
        ]



    def create(self, validated_data):
        cart_items_data = validated_data.pop('cart_items', [])
        user = validated_data.pop('user_id')
        payment_method_id = validated_data.pop('payment_method_id')  # Extract payment_method

        # Correct the field name to payment_method_id
        order = Order.objects.create(user_id=user, payment_method_id=payment_method_id, **validated_data)

        for item_data in cart_items_data:
            OrderItem.objects.create(order=order, **item_data)

        return order


















class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ['payment_method_id', 'user', 'method_name', 'created_at']

