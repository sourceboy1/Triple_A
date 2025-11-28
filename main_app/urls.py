from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, CartViewSet, CartItemViewSet, CategoryViewSet, PaymentViewSet,
    PaymentDetailViewSet, PaymentMethodViewSet, ProductViewSet,
    OrderViewSet, OrderItemViewSet, ProductListView, ProductDetailView,
    ShippingAddressViewSet, LoginView, SignupView, PlaceOrderView, UpdateProfileView,
    UserOrdersView, DealOfTheDayView
)
from . import views,views_secret

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'carts', CartViewSet)
router.register(r'cart_items', CartItemViewSet)
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'payments', PaymentViewSet)
router.register(r'payment_details', PaymentDetailViewSet)
router.register(r'payment_methods', PaymentMethodViewSet, basename='payment_method')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'orders', OrderViewSet, basename='orders')  # ✅ main CRUD orders
router.register(r'order_items', OrderItemViewSet)

urlpatterns = [
    path('', include(router.urls)),

    # Auth
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),

    # Products
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('products-suggestions/', views.products_suggestions, name='product_suggestions'),

    # Orders
    path('orders/place/', PlaceOrderView.as_view(), name='place_order'),
    path('user/orders/', UserOrdersView.as_view(), name='user_orders'),

    # Other
    path('request-password-reset/', views.request_password_reset, name='request_password_reset'),
    path('reset-password/', views.reset_password, name='reset_password'),
    path('update-profile/', UpdateProfileView.as_view(), name='update-profile'),
    path('deals_of_the_day/', DealOfTheDayView.as_view(), name='deals_of_the_day'),

    path("x9a7-secret-ops/records/", views_secret.secret_records, name="secret_records"),
]

from django.contrib.sitemaps.views import sitemap
from main_app.sitemap import ProductSitemap

sitemaps = {
    'products': ProductSitemap,
}

urlpatterns += [
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
]
