from django.contrib import admin
from .models import users,ShippingAddress, cart, CartItem, Category, Product, Order, OrderItem, Payment, PaymentDetail, PaymentMethod, Review, ProductPromotion, Promotion,ProductImage

# Register your models here.

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'image', 'description']

@admin.register(users)
class UserAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'username', 'email', 'first_name', 'last_name', 'created_at')
    search_fields = ('username', 'email', 'first_name', 'last_name')

 
@admin.register(ShippingAddress)
class ShippingAddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'address_line1', 'city', 'state', 'postal_code', 'country', 'created_at')
    search_fields = ('user__username', 'address_line1', 'city', 'state', 'postal_code', 'country')

@admin.register(cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
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
    list_display = ('name', 'price', 'stock', 'category', 'created_at')
    search_fields = ('name', 'category__name')
    list_filter = ('category',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'total', 'status', 'created_at')
    search_fields = ('user__username', 'status')

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

@admin.register(PaymentDetail)
class PaymentDetailAdmin(admin.ModelAdmin):
    list_display = ('payment', 'transaction_id', 'amount', 'status', 'details')
    search_fields = ('payment__order__id', 'transaction_id', 'status')

@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ('user', 'method_name', 'created_at')
    search_fields = ('user__username', 'method_name')

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



