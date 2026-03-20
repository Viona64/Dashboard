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

class DashboardLayoutSerializer(serializers.Serializer):
    layout_config = serializers.JSONField()
    
    def update(self, instance, validated_data):
        instance.layout_config = validated_data.get('layout_config', instance.layout_config)
        instance.save()
        return instance

class DashboardCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DashboardConfig
        fields = ['name', 'layout_config']
    
    def create(self, validated_data):
        return super().create(validated_data)  # Remove owner assignment
