from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model
from .models import ShippingAddress, Cart, CartItem, Category, Product, Order, OrderItem, Payment, PaymentDetail, PaymentMethod, Review, ProductPromotion, Promotion, ProductImage

# Get the user model
CustomUser = get_user_model()

@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'address', 'phone')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )

    ordering = ('username',)




 
@admin.register(ShippingAddress)
class ShippingAddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'address_line1', 'city', 'state', 'postal_code', 'country', 'created_at')
    search_fields = ('user__username', 'address_line1', 'city', 'state', 'postal_code', 'country')

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'product', 'quantity')
    search_fields = ('user__username',)

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('cart', 'product', 'quantity')
    search_fields = ('cart__user__username', 'product__name')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('product_id', 'name', 'price', 'original_price', 'discount', 'stock', 'category', 'created_at', 'image')
    search_fields = ('name', 'description', 'category__name')
    list_filter = ('category', 'created_at')
    fields = ('name', 'description', 'price', 'original_price', 'discount', 'stock', 'category', 'image')

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'image', 'secondary_image', 'tertiary_image', 'quaternary_image', 'description')
    search_fields = ('product__name', 'description')
    list_filter = ('product',)



class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'order_id', 'user_id', 'total_amount', 'created_at', 'first_name',
        'last_name', 'address', 'city', 'state', 'postal_code',
        'country', 'phone', 'shipping_method', 'order_note', 'payment_method', 'shipping_cost'
    )

    list_filter = (
        'created_at', 'shipping_method', 'payment_method'
    )

    search_fields = (
        'order_id', 'first_name', 'last_name', 'address', 'city', 'state', 'country', 'phone', 'payment_method'
    )

admin.site.register(Order, OrderAdmin)

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'price')
    search_fields = ('order__user__username', 'product__name')

class PaymentAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'payment_method_name', 'amount', 'payment_date', 'status')

    def order_id(self, obj):
        return obj.order.id

    def payment_method_name(self, obj):
        return obj.payment_method.method_name

    # Add search fields if necessary
    search_fields = ('order__id', 'payment_method__method_name', 'amount', 'status')



@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ('payment_method_id', 'method_name', 'user', 'created_at')



@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'rating', 'created_at')
    search_fields = ('product__name', 'user__username')
    list_filter = ('rating',)

@admin.register(ProductPromotion)
class ProductPromotionAdmin(admin.ModelAdmin):
    list_display = ('product', 'promotion', 'discount_value')
    search_fields = ('product__name', 'promotion__code')

@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ('code', 'description', 'discount_type', 'discount_value', 'start_date', 'end_date', 'usage_limit', 'usage_count', 'status', 'created_at')
    search_fields = ('code', 'description')
    list_filter = ('discount_type', 'status')



