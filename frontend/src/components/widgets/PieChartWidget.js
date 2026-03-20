import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useOrderData } from '../../hooks/useOrderData';
import { groupDataByStatus, groupDataByProduct } from '../../utils/dataProcessing';
import { getInsightForWidget } from '../../utils/insightGenerator';
import Insights from '../common/Insights';

const COLORS = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#17a2b8'];

const PieChartWidget = ({ widget }) => {
  const { orders, loading, error } = useOrderData();

  const getChartData = () => {
    const config = widget.config || {};
    const dataType = config.dataType || 'status';
    
    switch (dataType) {
      case 'status':
        return groupDataByStatus(orders).map(item => ({
          name: item.status,
          value: item.count,
          revenue: item.revenue,
        }));
      case 'product':
        return groupDataByProduct(orders).slice(0, 6).map(item => ({
          name: item.product,
          value: item.count,
          revenue: item.revenue,
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
  const showLegend = config.showLegend !== false;
  const insights = getInsightForWidget(orders, 'pie');

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
      <Insights insights={insights} maxItems={2} />
    </div>
  );
};

export default PieChartWidget;
