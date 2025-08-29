from rest_framework import serializers
from .models import CustomUser, Cart, CartItem, Category, Payment,PaymentDetail,PaymentMethod,Product,Order,OrderItem,ShippingAddress,ProductImage
from django.contrib.auth import authenticate, get_user_model
from django.utils import timezone
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import cloudinary
import cloudinary.utils
from django.utils.translation import gettext as _


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

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT login serializer that allows login with either email or username.
    """
    def validate(self, attrs):
        login = attrs.get("email") or attrs.get("username")  # user can pass either
        password = attrs.get("password")

        if not login or not password:
            raise serializers.ValidationError(_("Must include 'email/username' and 'password'."))

        user = None

        # Try authenticating with email
        try:
            user_obj = User.objects.get(email=login)
            user = authenticate(
                request=self.context.get("request"),
                email=user_obj.email,
                password=password
            )
        except User.DoesNotExist:
            pass

        # If not found with email, try username
        if user is None:
            try:
                user_obj = User.objects.get(username=login)
                user = authenticate(
                    request=self.context.get("request"),
                    email=user_obj.email,  # ✅ notice: we still use email, since USERNAME_FIELD=email
                    password=password
                )
            except User.DoesNotExist:
                pass

        if user is None:
            raise serializers.ValidationError(_("Invalid login credentials"))

        refresh = self.get_token(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token), # pyright: ignore[reportAttributeAccessIssue]
            "user": {
                "id": user.id, # type: ignore
                "email": user.email,
                "username": user.username,
            }
        }


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
    image_urls = serializers.SerializerMethodField()
    secondary_image_urls = serializers.SerializerMethodField()
    tertiary_image_urls = serializers.SerializerMethodField()
    quaternary_image_urls = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = [
            'id', 'image_urls', 'secondary_image_urls',
            'tertiary_image_urls', 'quaternary_image_urls',
            'description'
        ]

    def get_cloudinary_urls(self, image):
        """Return Cloudinary URLs in multiple sizes"""
        sizes = {
            'thumbnail': 200,
            'medium': 500,
            'large': 1000
        }
        urls = {}
        for label, width in sizes.items():
            if image:
                url, _ = cloudinary.utils.cloudinary_url(
                    image.name,
                    width=width,
                    crop='scale',
                    quality='auto',
                    secure=True
                )
                urls[label] = url
            else:
                # Fallback to a placeholder image on Cloudinary if needed
                urls[label] = cloudinary.utils.cloudinary_url(
                    "default.jpg", secure=True  # Make sure you upload a default.jpg to Cloudinary
                )[0]
        return urls

    def get_image_urls(self, obj):
        return self.get_cloudinary_urls(obj.image)

    def get_secondary_image_urls(self, obj):
        return self.get_cloudinary_urls(obj.secondary_image)

    def get_tertiary_image_urls(self, obj):
        return self.get_cloudinary_urls(obj.tertiary_image)

    def get_quaternary_image_urls(self, obj):
        return self.get_cloudinary_urls(obj.quaternary_image)


class ProductSerializer(serializers.ModelSerializer):
    image_urls = serializers.SerializerMethodField()
    secondary_image_urls = serializers.SerializerMethodField()
    category_id = serializers.IntegerField(source='category.id', read_only=True)
    additional_images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'product_id', 'name', 'description', 'price', 'original_price',
            'discount', 'stock', 'category', 'category_id', 'image_urls',
            'secondary_image_urls', 'additional_images', 'created_at'
        ]

    def get_image_urls(self, obj):
        """Return main product image URLs from Cloudinary"""
        return ProductImageSerializer(context=self.context).get_cloudinary_urls(obj.image)

    def get_secondary_image_urls(self, obj):
        """Return first additional image's secondary image or fallback"""
        first_additional_image = obj.additional_images.first()
        if first_additional_image and first_additional_image.secondary_image:
            return ProductImageSerializer(context=self.context).get_cloudinary_urls(
                first_additional_image.secondary_image
            )
        # Fallback to default placeholder on Cloudinary
        return ProductImageSerializer(context=self.context).get_cloudinary_urls(None)




class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category_id', 'name']



class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = ['address', 'city', 'state', 'postal_code', 'country']



# serializers.py

class OrderItemSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())  # write with ID
    product_name = serializers.CharField(source='product.name', read_only=True)   # read-only
    product_image = serializers.SerializerMethodField()  # read-only

    name = serializers.CharField(required=False, write_only=True)
    image_url = serializers.CharField(required=False, write_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'order_item_id',
            'product', 'product_name', 'product_image',
            'quantity', 'price', 'name', 'image_url'
        ]

    def get_product_image(self, obj):
        request = self.context.get('request')
        if obj.product and obj.product.image:
            if request:
                return request.build_absolute_uri(obj.product.image.url)
            return obj.product.image.url
        return None





class OrderSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    payment_method_id = serializers.PrimaryKeyRelatedField(queryset=PaymentMethod.objects.all())
    cart_items = OrderItemSerializer(many=True)  # ✅ writable + readable

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
        payment_method = validated_data.pop('payment_method_id')

        order = Order.objects.create(
            user_id=user,
            payment_method_id=payment_method,
            **validated_data
        )

        for item_data in cart_items_data:
            item_data.pop('name', None)
            item_data.pop('image_url', None)
            OrderItem.objects.create(order=order, **item_data)

        return order







class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ['payment_method_id', 'user', 'method_name', 'created_at']

