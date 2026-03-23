import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useOrderDataContext } from '../../contexts/OrderDataContext';
import { getInsightForWidget } from '../../utils/insightGenerator';
import Insights from '../common/Insights';

const LineChartWidget = ({ widget }) => {
  const { aggregations, loading, error } = useOrderDataContext();

  const getChartData = () => {
    const config = widget.config || {};
    const dataType = config.dataType || 'monthly';
    
    if (dataType === 'monthly') {
      return Object.entries(aggregations.monthlyRevenue || {})
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-12) // Last 12 months for performance
        .map(([month, revenue]) => ({
          month: month.substring(5), // Show only month
          revenue,
        }));
    }
    return [];
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
  const insights = getInsightForWidget([], 'line');

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
