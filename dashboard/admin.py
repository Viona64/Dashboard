from django.contrib import admin
from .models import Customer, CustomerOrder, DashboardConfig

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'created_at']
    search_fields = ['name', 'email']
    ordering = ['name']

@admin.register(CustomerOrder)
class CustomerOrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'customer', 'amount', 'status', 'order_date', 'created_at']
    list_filter = ['status', 'order_date', 'created_at']
    search_fields = ['order_number', 'customer__name']
    ordering = ['-order_date']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(DashboardConfig)
class DashboardConfigAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'is_active', 'created_at', 'updated_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'owner__username']
    ordering = ['name']
    readonly_fields = ['created_at', 'updated_at']
