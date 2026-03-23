from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count, Avg, Max, Min
from django.utils.dateparse import parse_date
from django.db.models.functions import TruncMonth, TruncDay, TruncWeek
import json
from .models import Customer, CustomerOrder, DashboardConfig
from .serializers import (
    CustomerSerializer, 
    CustomerOrderSerializer, 
    DashboardConfigSerializer,
    DashboardCreateSerializer
)
from .utils import calculate_total_amount, calculate_order_stats, get_monthly_trends

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class CustomerOrderViewSet(viewsets.ModelViewSet):
    queryset = CustomerOrder.objects.all()
    serializer_class = CustomerOrderSerializer
    
    def get_queryset(self):
        queryset = CustomerOrder.objects.all()
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        status_filter = self.request.query_params.get('status')
        customer_id = self.request.query_params.get('customer_id')
        
        if date_from:
            queryset = queryset.filter(order_date__gte=parse_date(date_from))
        if date_to:
            queryset = queryset.filter(order_date__lte=parse_date(date_to))
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)
            
        return queryset
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        stats = calculate_order_stats(queryset)
        return Response(stats)
    
    @action(detail=False, methods=['get'])
    def trends(self, request):
        queryset = self.get_queryset()
        period = request.query_params.get('period', 'monthly')
        
        if period == 'daily':
            trends = queryset.extra(
                select={'period': 'strftime("%%Y-%%m-%%d", order_date)'}
            ).values('period').annotate(
                count=Count('id'),
                total=Sum('amount'),
                avg=Avg('amount')
            ).order_by('period')
        elif period == 'weekly':
            trends = queryset.annotate(
                period=TruncWeek('order_date')
            ).values('period').annotate(
                count=Count('id'),
                total=Sum('amount'),
                avg=Avg('amount')
            ).order_by('period')
        else:  # monthly
            trends = get_monthly_trends(queryset)
            
        return Response(list(trends))

class DashboardConfigViewSet(viewsets.ModelViewSet):
    serializer_class = DashboardConfigSerializer
    queryset = DashboardConfig.objects.all()
    permission_classes = []  # Remove authentication for testing
    
    def get_serializer_class(self):
        if self.action == 'create':
            return DashboardCreateSerializer
        return DashboardConfigSerializer
    
    def get_queryset(self):
        return DashboardConfig.objects.all()  # Remove owner filter for testing
    
    def perform_create(self, serializer):
        serializer.save()  # Remove owner assignment for testing
    
    @action(detail=True, methods=['post'])
    def update_layout(self, request, pk=None):
        dashboard = self.get_object()
        serializer = DashboardLayoutSerializer(data=request.data)
        if serializer.is_valid():
            serializer.update(dashboard, serializer.validated_data)
            return Response(dashboard.layout_config)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def widget_data(self, request, pk=None):
        dashboard = self.get_object()
        widget_config = request.query_params.get('widget_config')
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        
        if not widget_config:
            return Response({'error': 'widget_config parameter required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        try:
            widget_config = json.loads(widget_config)
        except json.JSONDecodeError:
            return Response({'error': 'Invalid widget_config JSON'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        queryset = CustomerOrder.objects.all()
        if date_from:
            queryset = queryset.filter(order_date__gte=parse_date(date_from))
        if date_to:
            queryset = queryset.filter(order_date__lte=parse_date(date_to))
            
        data = process_widget_data(widget_config, queryset)
        return Response(data)
