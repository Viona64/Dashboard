# Smart Insight Dashboard Builder - Django Backend

A Django REST API backend for the Smart Insight Dashboard Builder system.

## Features

- Customer and Order Management (CRUD)
- Dashboard Configuration Storage
- Widget Data Processing (KPI, Charts, Tables)
- Date Range Filtering
- Order Statistics and Trends
- RESTful API with Django REST Framework

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database configuration
```

4. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create superuser:
```bash
python manage.py createsuperuser
```

6. Run development server:
```bash
python manage.py runserver
```

## API Endpoints

### Customers
- `GET /api/customers/` - List customers
- `POST /api/customers/` - Create customer
- `GET /api/customers/{id}/` - Get customer
- `PUT /api/customers/{id}/` - Update customer
- `DELETE /api/customers/{id}/` - Delete customer

### Orders
- `GET /api/orders/` - List orders (supports filtering)
- `POST /api/orders/` - Create order
- `GET /api/orders/{id}/` - Get order
- `PUT /api/orders/{id}/` - Update order
- `DELETE /api/orders/{id}/` - Delete order
- `GET /api/orders/stats/` - Get order statistics
- `GET /api/orders/trends/` - Get order trends

### Dashboards
- `GET /api/dashboards/` - List user dashboards
- `POST /api/dashboards/` - Create dashboard
- `GET /api/dashboards/{id}/` - Get dashboard
- `PUT /api/dashboards/{id}/` - Update dashboard
- `DELETE /api/dashboards/{id}/` - Delete dashboard
- `POST /api/dashboards/{id}/update_layout/` - Update dashboard layout
- `GET /api/dashboards/{id}/widget_data/` - Get widget data

## Query Parameters

### Orders Filtering
- `date_from` - Filter orders from date (YYYY-MM-DD)
- `date_to` - Filter orders to date (YYYY-MM-DD)
- `status` - Filter by order status
- `customer_id` - Filter by customer ID

### Widget Data
- `widget_config` - JSON configuration for widget
- `date_from` - Filter data from date
- `date_to` - Filter data to date

## Widget Types

### KPI Widget
```json
{
  "type": "kpi",
  "config": {
    "title": "Total Revenue",
    "metric": "sum",
    "field": "amount",
    "format": "currency"
  }
}
```

### Chart Widget
```json
{
  "type": "chart",
  "config": {
    "title": "Orders Trend",
    "chartType": "line",
    "xAxis": "order_date",
    "yAxis": "amount",
    "aggregation": "monthly"
  }
}
```

### Table Widget
```json
{
  "type": "table",
  "config": {
    "title": "Recent Orders",
    "limit": 10,
    "orderBy": "-order_date"
  }
}
```
