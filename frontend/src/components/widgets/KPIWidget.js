import React from 'react';
import { useOrderData } from '../../hooks/useOrderData';
import { calculateTotalRevenue, countOrders, getAverageOrderValue, formatCurrency, formatNumber } from '../../utils/dataProcessing';
import { getInsightForWidget } from '../../utils/insightGenerator';
import Insights from '../common/Insights';

const KPIWidget = ({ widget }) => {
  const { orders, loading, error } = useOrderData();

  const getKPIData = () => {
    const config = widget.config || {};
    const metric = config.metric || 'total_revenue';
    
    switch (metric) {
      case 'total_revenue':
        return {
          value: formatCurrency(calculateTotalRevenue(orders)),
          label: 'Total Revenue',
        };
      case 'total_orders':
        return {
          value: formatNumber(countOrders(orders)),
          label: 'Total Orders',
        };
      case 'avg_order_value':
        return {
          value: formatCurrency(getAverageOrderValue(orders)),
          label: 'Avg Order Value',
        };
      default:
        return {
          value: '0',
          label: 'Metric',
        };
    }
  };

  if (loading) {
    return (
      <div className="kpi-widget">
        <h3>{widget.title}</h3>
        <div className="kpi-value">Loading...</div>
        <div className="kpi-title">Please wait</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="kpi-widget">
        <h3>{widget.title}</h3>
        <div className="kpi-value">Error</div>
        <div className="kpi-title">Failed to load data</div>
      </div>
    );
  }

  const kpiData = getKPIData();
  const insights = getInsightForWidget(orders, 'kpi');

  return (
    <div className="kpi-widget">
      <h3>{widget.title}</h3>
      <div className="kpi-value">{kpiData.value}</div>
      <div className="kpi-title">{kpiData.label}</div>
      <Insights insights={insights} maxItems={2} />
    </div>
  );
};

export default KPIWidget;
