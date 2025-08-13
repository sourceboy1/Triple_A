from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, CartViewSet, CartItemViewSet, CategoryViewSet, PaymentViewSet,
    PaymentDetailViewSet, PaymentMethodViewSet, ProductViewSet, ReviewViewSet,
    OrderViewSet, OrderItemViewSet, ProductListView, ProductDetailView,
    ShippingAddressViewSet, LoginView, SignupView, PlaceOrderView, UpdateProfileView,
    UserOrdersView,OrderDetailView,DealOfTheDayView,
)

from . import views

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'carts', CartViewSet)
router.register(r'cart_items', CartItemViewSet)
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'payments', PaymentViewSet)
router.register(r'payment_details', PaymentDetailViewSet)
router.register(r'payment_methods', PaymentMethodViewSet, basename='payment_method')
router.register(r'products', ProductViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'order_items', OrderItemViewSet)



urlpatterns = [
    path('', include(router.urls)),
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/suggestions/', views.product_suggestions, name='product_suggestions'),
    path('api/orders/', PlaceOrderView.as_view(), name='place_order'),
    path('request-password-reset/', views.request_password_reset, name='request_password_reset'),
    path('reset-password/', views.reset_password, name='reset_password'),
    path('update-profile/', UpdateProfileView.as_view(), name='update-profile'),
    path('api/user/orders/', UserOrdersView.as_view(), name='user_orders'),
    path('orders/<int:order_id>/', OrderDetailView.as_view(), name='order-detail'),
    path('deals_of_the_day/', DealOfTheDayView.as_view(), name='deals_of_the_day'),
]
