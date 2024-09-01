from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, CartViewSet, CartItemViewSet, CategoryViewSet, PaymentViewSet,
    PaymentDetailViewSet, PaymentMethodViewSet, ProductViewSet, ReviewViewSet,
    OrderViewSet, OrderItemViewSet, ProductListView, ProductDetailView,
    ShippingAddressViewSet, LoginView, SignupView,PlaceOrderView,
   
)
from . import views

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'carts', CartViewSet)
router.register(r'cart_items', CartItemViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'payment_details', PaymentDetailViewSet)
router.register(r'payment_methods', PaymentMethodViewSet, basename='payment_method')
router.register(r'products', ProductViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'order_items', OrderItemViewSet)
router.register(r'shipping-addresses', ShippingAddressViewSet, basename='shippingaddress')

urlpatterns = [
    path('', include(router.urls)),
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('products/<int:product_id>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/suggestions/', views.product_suggestions, name='product_suggestions'),
    path('api/orders/', PlaceOrderView.as_view(), name='place_order'),
    path('request-password-reset/', views.request_password_reset, name='request_password_reset'),
    path('reset-password/', views.reset_password, name='reset_password'),
    
]
