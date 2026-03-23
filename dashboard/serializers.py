from rest_framework import serializers
from .models import Customer, CustomerOrder, DashboardConfig

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class CustomerOrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    
    class Meta:
        model = CustomerOrder
        fields = '__all__'

class DashboardConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = DashboardConfig
        fields = '__all__'
        read_only_fields = ['owner']

class DashboardCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DashboardConfig
        fields = ['name', 'layout_config']
