from django.db.models import Sum, Count, Avg, Max, Min
from django.utils.dateparse import parse_date
from django.db.models.functions import TruncMonth, TruncDay, TruncWeek
from .models import CustomerOrder
import calendar
from datetime import datetime

def calculate_total_amount(queryset):
    return queryset.aggregate(total=Sum('amount'))['total'] or 0

def calculate_order_stats(queryset):
    return {
        'count': queryset.count(),
        'total_amount': calculate_total_amount(queryset),
        'avg_amount': queryset.aggregate(avg=Avg('amount'))['avg'] or 0,
        'max_amount': queryset.aggregate(max=Max('amount'))['max'] or 0,
        'min_amount': queryset.aggregate(min=Min('amount'))['min'] or 0
    }

def get_orders_by_date_range(date_from=None, date_to=None):
    queryset = CustomerOrder.objects.all()
    if date_from:
        queryset = queryset.filter(order_date__gte=parse_date(date_from))
    if date_to:
        queryset = queryset.filter(order_date__lte=parse_date(date_to))
    return queryset

def get_monthly_trends(queryset):
    return queryset.extra(
        select={'month': 'strftime("%%Y-%%m", order_date)'}
    ).values('month').annotate(
        count=Count('id'),
        total=Sum('amount'),
        avg=Avg('amount')
    ).order_by('month')

def process_table_data(config, queryset):
    limit = config.get('limit', 10)
    order_by = config.get('orderBy', '-order_date')
    
    data = queryset.order_by(order_by)[:limit]
    
    return {
        'data': [
            {
                'id': item.id,
                'order_number': item.order_number,
                'customer_name': item.customer.name,
                'amount': float(item.amount),
                'status': item.status,
                'order_date': item.order_date.strftime('%Y-%m-%d')
            }
            for item in data
        ],
        'title': config.get('title', 'Orders Table')
    }
