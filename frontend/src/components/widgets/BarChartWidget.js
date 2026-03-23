import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useOrderDataContext } from '../../contexts/OrderDataContext';
import { getInsightForWidget } from '../../utils/insightGenerator';
import Insights from '../common/Insights';

const BarChartWidget = ({ widget }) => {
  const { aggregations, loading, error } = useOrderDataContext();

  const getChartData = () => {
    const config = widget.config || {};
    const dataType = config.dataType || 'product';
    
    if (dataType === 'product') {
      return Object.entries(aggregations.revenueByProduct || {})
        .slice(0, 10) // Limit to top 10 for performance
        .map(([name, value]) => ({
          name,
          revenue: value,
        }));
    } else if (dataType === 'monthly') {
      return Object.entries(aggregations.monthlyRevenue || {})
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-12) // Last 12 months
        .map(([month, value]) => ({
          name: month,
          revenue: value,
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
  const insights = getInsightForWidget([], 'bar');

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
