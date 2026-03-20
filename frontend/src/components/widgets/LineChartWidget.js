import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useOrderData } from '../../hooks/useOrderData';
import { getMonthlyRevenue } from '../../utils/dataProcessing';
import { getInsightForWidget } from '../../utils/insightGenerator';
import Insights from '../common/Insights';

const LineChartWidget = ({ widget }) => {
  const { orders, loading, error } = useOrderData();

  const getChartData = () => {
    const config = widget.config || {};
    const dataType = config.dataType || 'monthly';
    
    switch (dataType) {
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
  const insights = getInsightForWidget(orders, 'line');

  return (
    <div>
      <h3>{widget.title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke="#007bff" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
      <Insights insights={insights} maxItems={2} />
    </div>
  );
};

export default LineChartWidget;
