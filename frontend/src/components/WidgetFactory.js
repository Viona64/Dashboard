import React from 'react';
import KPIWidget from './widgets/KPIWidget';
import BarChartWidget from './widgets/BarChartWidget';
import LineChartWidget from './widgets/LineChartWidget';
import PieChartWidget from './widgets/PieChartWidget';
import TableWidget from './widgets/TableWidget';

const WidgetFactory = ({ widget }) => {
  const renderWidget = () => {
    switch (widget.type) {
      case 'kpi':
        return <KPIWidget widget={widget} />;
      case 'bar':
        return <BarChartWidget widget={widget} />;
      case 'line':
        return <LineChartWidget widget={widget} />;
      case 'pie':
        return <PieChartWidget widget={widget} />;
      case 'table':
        return <TableWidget widget={widget} />;
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
