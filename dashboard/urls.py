from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet, CustomerOrderViewSet, DashboardConfigViewSet

router = DefaultRouter()
router.register(r'customers', CustomerViewSet)
router.register(r'orders', CustomerOrderViewSet, basename='customerorder')
router.register(r'dashboard', DashboardConfigViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
