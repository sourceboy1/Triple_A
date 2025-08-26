from django.contrib import admin
from django.db import models
from django.contrib.auth.models import AbstractUser,BaseUserManager
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import datetime
from django.utils.timezone import now
from django.utils.translation import gettext_lazy as _
from cloudinary_storage.storage import MediaCloudinaryStorage


from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """Create and return a user with an email and password."""
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        extra_fields.setdefault("is_active", True)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # hash password
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and return a superuser."""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # ✅ Add this line
    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.username





    




class PasswordResetToken(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    token = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        # Tokens expire after 1 hour
        return self.created_at < timezone.now() - datetime.timedelta(hours=1)   



class Category(models.Model):
    category_id = models.AutoField(primary_key=True)  # Use this as the primary key
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = True
        db_table = 'categories'
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name

class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    stock = models.IntegerField()
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, blank=True, null=True)
    image = models.ImageField(upload_to='products/', blank=True, null=True,storage=MediaCloudinaryStorage())
    created_at = models.DateTimeField(auto_now_add=True)
    is_deal_of_the_day = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    is_new = models.BooleanField(default=False)

    class Meta:
        managed = True
        db_table = 'products'
        verbose_name = 'Product'
        verbose_name_plural = 'Products'
        ordering = ['name']

    def __str__(self):
        return self.name

    @property
    def id(self):
        """Alias for product_id so code expecting `id` works"""
        return self.product_id




class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='additional_images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/additional/', null=True, blank=True,storage=MediaCloudinaryStorage())
    secondary_image = models.ImageField(upload_to='products/additional/', null=True, blank=True,storage=MediaCloudinaryStorage())
    tertiary_image = models.ImageField(upload_to='products/additional/', null=True, blank=True,storage=MediaCloudinaryStorage())
    quaternary_image = models.ImageField(upload_to='products/additional/', null=True, blank=True,storage=MediaCloudinaryStorage())
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'product_image'

    def __str__(self):
        return f"Image for {self.product.name}"


    

class Cart(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'cart'

class CartItem(models.Model):
    cart_item_id = models.AutoField(primary_key=True)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    class Meta:
        db_table = 'cart_items'



class PaymentMethod(models.Model):
    payment_method_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('main_app.CustomUser', on_delete=models.CASCADE,)  # Adjust if using a different user model
    method_name = models.CharField(max_length=100)
    details = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'payment_method'


class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    payment_id = models.AutoField(primary_key=True)
    order_id = models.IntegerField()  # Order relationship can be added if needed
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=PAYMENT_STATUS_CHOICES, default='pending')

    class Meta:
        managed = False
        db_table = 'payments'
        verbose_name = 'Payment'
        verbose_name_plural = 'Payments'
        ordering = ['payment_date']

    def __str__(self):
        return f"Payment {self.payment_id} for Order {self.order_id}"

class PaymentDetail(models.Model):
    PAYMENT_DETAIL_STATUS_CHOICES = [
        ('success', 'Success'),
        ('failure', 'Failure'),
        ('pending', 'Pending'),
    ]

    payment_detail_id = models.AutoField(primary_key=True)
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE)
    transaction_id = models.CharField(max_length=255, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=PAYMENT_DETAIL_STATUS_CHOICES, default='pending')
    details = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'payment_details'
        verbose_name = 'Payment Detail'
        verbose_name_plural = 'Payment Details'
        ordering = ['payment_detail_id']

    def __str__(self):
        return f"PaymentDetail {self.payment_detail_id} for Payment {self.payment.payment_id}"




class ShippingAddress(models.Model):
    user_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=1)  # type: ignore # Assuming 1 is a valid user ID
    address = models.TextField(default='Default Address')
    city = models.CharField(max_length=50, default='default_city')
    state = models.CharField(max_length=50, default='default_state')
    postal_code = models.CharField(max_length=10, default="00000")
    country = models.CharField(max_length=100, default='Unknown')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'shipping_addresses'
        verbose_name = 'Shipping Address'
        verbose_name_plural = 'Shipping Addresses'

    def __str__(self):
        return f"{self.address}, {self.city}, {self.country}"



class Order(models.Model): 
    ORDER_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    order_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    email = models.EmailField(default="noemail@example.com")
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0) # type: ignore
    created_at = models.DateTimeField(auto_now_add=True)
    first_name = models.CharField(max_length=50, default='DefaultFirstName')
    last_name = models.CharField(max_length=50, default='DefaultLastname')
    address = models.TextField(default='Default Address')
    city = models.CharField(max_length=50, default='default_city')
    state = models.CharField(max_length=50, default='default_state')
    postal_code = models.CharField(max_length=10, default="00000")
    country = models.CharField(max_length=100, default='Unknown')
    phone = models.CharField(max_length=20, default='0000000000')
    shipping_method = models.CharField(max_length=50, default="standard")
    order_note = models.TextField(null=True, blank=True)
    payment_method_id = models.ForeignKey(PaymentMethod, on_delete=models.SET_NULL, null=True, blank=True)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=ORDER_STATUS_CHOICES, default='pending')

    class Meta:
        db_table = 'orders'

    def __str__(self):
        return f"Order {self.order_id} for User {self.user_id.username}" # type: ignore

    


class OrderItem(models.Model):
    order_item_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, related_name='cart_items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, default=1) # type: ignore
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'order_items'
        verbose_name = 'Order Item'
        verbose_name_plural = 'Order Items'
        ordering = ['order_item_id']

    def __str__(self):
        return f"OrderItem {self.order_item_id} for Order {self.order.order_id}"



