import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useOrderData } from '../../hooks/useOrderData';
import { groupDataByProduct, getMonthlyRevenue } from '../../utils/dataProcessing';
import { getInsightForWidget } from '../../utils/insightGenerator';
import Insights from '../common/Insights';

const BarChartWidget = ({ widget }) => {
  const { orders, loading, error } = useOrderData();

  const getChartData = () => {
    const config = widget.config || {};
    const dataType = config.dataType || 'product';
    
    switch (dataType) {
      case 'product':
        return groupDataByProduct(orders).map(item => ({
          name: item.product,
          revenue: item.revenue,
          count: item.count,
        }));
      case 'monthly':
        return getMonthlyRevenue(orders).map(item => ({
          name: item.month,
          revenue: item.revenue,
          count: item.count,
        }));
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div>
        <h3>{widget.title}</h3>
        <div className="chart-placeholder">
          Loading chart data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h3>{widget.title}</h3>
        <div className="chart-placeholder">
          Error loading chart data
        </div>
      </div>
    );
  }

  const data = getChartData();
  const config = widget.config || {};
  const dataKey = config.dataKey || 'revenue';
  const insights = getInsightForWidget(orders, 'bar');

  return (
    <div>
      <h3>{widget.title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey={dataKey} fill="#007bff" />
        </BarChart>
      </ResponsiveContainer>
      <Insights insights={insights} maxItems={2} />
    </div>
  );
};

export default BarChartWidget;
