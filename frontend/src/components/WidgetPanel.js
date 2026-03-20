import React from 'react';

const WidgetPanel = ({ onAddWidget }) => {
  const widgetTypes = [
    { type: 'kpi', title: 'KPI Card', description: 'Display key metrics' },
    { type: 'bar', title: 'Bar Chart', description: 'Vertical bar chart' },
    { type: 'line', title: 'Line Chart', description: 'Trend line chart' },
    { type: 'pie', title: 'Pie Chart', description: 'Pie chart visualization' },
    { type: 'table', title: 'Table', description: 'Data table display' },
  ];

  return (
    <div className="widget-panel">
      <div className="panel-header">
        <h2>Widgets</h2>
      </div>
      {widgetTypes.map((widget) => (
        <div
          key={widget.type}
          className="widget-item"
          onClick={() => onAddWidget(widget.type)}
        >
          <h4>{widget.title}</h4>
          <p>{widget.description}</p>
        </div>
      ))}
    </div>
  );
};

export default WidgetPanel;
