import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useOrderDataContext } from '../../contexts/OrderDataContext';

const COLORS = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#17a2b8'];

const PieChartWidget = ({ widget }) => {
  const { aggregations, loading, error } = useOrderDataContext();

  const getChartData = () => {
    const config = widget.config || {};
    const dataType = config.dataType || 'status';
    
    if (dataType === 'status') {
      return Object.entries(aggregations.ordersByStatus || {})
        .map(([name, value]) => ({ name, value }));
    } else if (dataType === 'product') {
      return Object.entries(aggregations.revenueByProduct || {})
        .slice(0, 8) // Limit to top 8 for performance
        .map(([name, value]) => ({ name, value }));
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
  const showLegend = config.showLegend !== false;

  return (
    <div>
      <h3>{widget.title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={70}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartWidget;
