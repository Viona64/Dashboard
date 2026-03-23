import React from 'react';
import { MemoizedKPIWidget, MemoizedTableWidget } from './widgets/MemoizedWidgets';
import BarChartWidget from './widgets/BarChartWidget';
import LineChartWidget from './widgets/LineChartWidget';
import PieChartWidget from './widgets/PieChartWidget';

const WidgetFactory = ({ widget }) => {
  const renderWidget = () => {
    switch (widget.type) {
      case 'kpi':
        return <MemoizedKPIWidget widget={widget} />;
      case 'bar':
        return <BarChartWidget widget={widget} />;
      case 'line':
        return <LineChartWidget widget={widget} />;
      case 'pie':
        return <PieChartWidget widget={widget} />;
      case 'table':
        return <MemoizedTableWidget widget={widget} />;
      default:
        return <div>Unknown widget type</div>;
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {renderWidget()}
    </div>
  );
};

export default WidgetFactory;
