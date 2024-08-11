from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserViewSet, CartViewSet ,CartItemViewSet, CategoryViewSet,PaymentViewSet,PaymentDetailViewSet,PaymentMethodViewSet,ProductViewSet,ReviewViewSet,OrderViewSet,OrderItemViewSet,register,signup,CustomTokenObtainPairView,PasswordResetRequestView, PasswordResetView,product_list,ProductListView,ProductDetailView,ProductImageUploadView

from . import views

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
    path('signup/', signup, name='signup'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('request-password-reset/', PasswordResetRequestView.as_view(), name='request-password-reset'),
    path('reset-password/<uid>/<token>/', PasswordResetView.as_view(), name='reset-password'),
    path('register/', register, name='register'),
    path('api/products/', product_list, name='product-list'),
    path('api/products/', ProductListView.as_view(), name='product_list'),
    path('products/<str:category>/', ProductListView.as_view(), name='product_list_by_category'),
    path('api/products/<int:product_id>/', ProductDetailView.as_view(), name='product-detail'),
    path('upload-images/', ProductImageUploadView.as_view(), name='upload-images'),
]

