from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model
from .models import ShippingAddress, Cart, CartItem, Category, Product, Order, OrderItem, Payment, PaymentDetail, PaymentMethod, ProductImage
from .utils.email_helpers import send_order_email, send_order_status_email


# Get the user model
CustomUser = get_user_model()

@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'address', 'phone', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'address', 'phone')

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'address', 'phone')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',), 'classes': ('collapse',)}),  # removed date_joined here
    )

    readonly_fields = ('date_joined',)  # make date_joined read-only

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'address', 'phone'),
        }),
    )

    ordering = ('username',)

@admin.register(ShippingAddress)
class ShippingAddressAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'address', 'city', 'state', 'postal_code', 'country', 'created_at')
    search_fields = ('user_id', 'address', 'city', 'state', 'postal_code', 'country')

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
    list_display = ('category_id', 'name', 'description', 'created_at')  
    search_fields = ('name',)
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'product_id', 'name', 'price', 'original_price', 'discount', 'stock',
        'category', 'is_deal_of_the_day', 'is_abroad_order', 'abroad_delivery_days',
        'created_at'
    )
    search_fields = ('name', 'product_id', 'slug', 'category__name')
    list_filter = ('category', 'created_at', 'is_deal_of_the_day', 'is_abroad_order', 'is_featured')
    fields = (
        'name', 'slug', 'description', 'price', 'original_price', 'discount', 'stock',
        'category', 'image',  # removed image_secondary
        'is_deal_of_the_day', 'is_featured', 'is_new',
        'is_abroad_order', 'abroad_delivery_days'
    )
    readonly_fields = ('created_at', 'updated_at')


# If Category is not already registered
# @admin.register(Category)
# class CategoryAdmin(admin.ModelAdmin):
#     list_display = ('name',)
#     search_fields = ('name',)

import logging

logger = logging.getLogger(__name__)

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'image', 'secondary_image', 'tertiary_image', 'quaternary_image', 'description')
    search_fields = ('product__name', 'description')
    list_filter = ('product',)

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'order_id', 'user_id', 'total_amount', 'created_at', 'first_name',
        'last_name', 'email', 'phone', 'shipping_method', 'order_note',
        'payment_method_id', 'shipping_cost', 'status', 'payment_confirmed'
    )
    fields = (
        'user_id', 'email', 'first_name', 'last_name',
        'phone', 'shipping_method', 'order_note', 'payment_method_id',
        'shipping_cost', 'total_amount', 'status', 'transaction_reference',
        'payment_confirmed'
    )
    readonly_fields = ('order_id', 'created_at')
    list_filter = (
        'created_at', 'shipping_method', 'payment_method_id', 'status', 'payment_confirmed'
    )
    search_fields = (
        'order_id', 'first_name', 'last_name', 'phone', 'payment_method__method_name'
    )
    list_editable = ('status',)
    inlines = [OrderItemInline]

    actions = [
        'mark_as_ready_for_pickup',
        'mark_as_shipped',
        'mark_as_delivered',
        'mark_as_cancelled',
        'send_confirmation_email',
    ]

    def mark_as_ready_for_pickup(self, request, queryset):
        sent_count = 0
        skipped = 0
        for order in queryset:
            if order.payment_confirmed:
                order.status = 'ready_for_pickup'
                order.save()  # email handled in model.save()
                sent_count += 1
            else:
                skipped += 1
        self.message_user(request, f"✅ {sent_count} orders marked Ready for Pickup and notified. {skipped} skipped (payment not confirmed).")

    def mark_as_shipped(self, request, queryset):
        sent_count = 0
        skipped = 0
        for order in queryset:
            if order.payment_confirmed:
                order.status = 'shipped'
                order.save()  # email handled in model.save()
                sent_count += 1
            else:
                skipped += 1
        self.message_user(request, f"🚚 {sent_count} orders marked Shipped and notified. {skipped} skipped (payment not confirmed).")

    def mark_as_delivered(self, request, queryset):
        sent_count = 0
        for order in queryset:
            if order.payment_confirmed:
                order.status = 'delivered'
                order.save()  # email handled in model.save()
                sent_count += 1
        self.message_user(request, f"✅ {sent_count} orders marked Delivered and notified.")

    def mark_as_cancelled(self, request, queryset):
        sent_count = 0
        for order in queryset:
            order.status = 'cancelled'
            order.save()  # email handled in model.save()
            sent_count += 1
        self.message_user(request, f"❌ {sent_count} orders marked Cancelled and notified.")

    def send_confirmation_email(self, request, queryset):
        """
        Re-send the initial 'order placed' email (useful if needed).
        """
        sent_count = 0
        for order in queryset:
            try:
                send_order_email(order.email, order, request=request)
                sent_count += 1
            except Exception as e:
                logger.exception("Failed to re-send confirmation for order %s: %s", order.order_id, e)
        self.message_user(request, f"📧 Re-sent order confirmation for {sent_count} orders.")

    # labels
    mark_as_ready_for_pickup.short_description = "Mark selected orders as Ready for Pickup (and notify customer)"
    mark_as_shipped.short_description = "Mark selected orders as Shipped (and notify customer)"
    mark_as_delivered.short_description = "Mark selected orders as Delivered (and notify customer)"
    mark_as_cancelled.short_description = "Mark selected orders as Cancelled (and notify customer)"
    send_confirmation_email.short_description = "Send (or re-send) order confirmation email"





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

    search_fields = ('order__id', 'payment_method__method_name', 'amount', 'status')

@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ('payment_method_id', 'method_name', 'user', 'created_at')
