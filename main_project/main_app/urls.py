from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, CartViewSet ,CartItemViewSet, CategoryViewSet,PaymentViewSet,PaymentDetailViewSet,PaymentMethodViewSet,ProductViewSet,ReviewViewSet,OrderViewSet,OrderItemViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'carts', CartViewSet)
router.register(r'cart_items', CartItemViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'payment_details', PaymentDetailViewSet)
router.register(r'payment_methods', PaymentMethodViewSet)
router.register(r'products', ProductViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'order_items', OrderItemViewSet)



urlpatterns = [
    path('', include(router.urls)),
]

