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

def process_widget_data(widget_config, queryset):
    widget_type = widget_config.get('type')
    config = widget_config.get('config', {})
    
    if widget_type == 'kpi':
        return process_kpi_data(config, queryset)
    elif widget_type == 'chart':
        return process_chart_data(config, queryset)
    elif widget_type == 'table':
        return process_table_data(config, queryset)
    else:
        return {'error': f'Unsupported widget type: {widget_type}'}

def process_kpi_data(config, queryset):
    metric = config.get('metric', 'count')
    field = config.get('field', 'amount')
    
    if metric == 'count':
        value = queryset.count()
    elif metric == 'sum':
        value = queryset.aggregate(total=Sum(field))['total'] or 0
    elif metric == 'avg':
        value = queryset.aggregate(avg=Avg(field))['avg'] or 0
    elif metric == 'max':
        value = queryset.aggregate(max=Max(field))['max'] or 0
    elif metric == 'min':
        value = queryset.aggregate(min=Min(field))['min'] or 0
    else:
        value = queryset.count()
    
    return {
        'value': value,
        'title': config.get('title', 'KPI'),
        'format': config.get('format', 'number')
    }

def process_chart_data(config, queryset):
    chart_type = config.get('chartType', 'line')
    x_axis = config.get('xAxis', 'order_date')
    y_axis = config.get('yAxis', 'amount')
    aggregation = config.get('aggregation', 'daily')
    
    if aggregation == 'daily':
        data = queryset.extra(
            select={'period': 'strftime("%%Y-%%m-%%d", order_date)'}
        ).values('period').annotate(
            value=Sum(y_axis) if y_axis == 'amount' else Count('id')
        ).order_by('period')
    elif aggregation == 'weekly':
        data = queryset.annotate(
            period=TruncWeek('order_date')
        ).values('period').annotate(
            value=Sum(y_axis) if y_axis == 'amount' else Count('id')
        ).order_by('period')
    else:  # monthly
        data = get_monthly_trends(queryset)
        data = [{'period': item['month'], 'value': item[y_axis] if y_axis in item else item['total']} 
                for item in data]
    
    return {
        'type': chart_type,
        'data': list(data),
        'title': config.get('title', 'Chart')
    }

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
