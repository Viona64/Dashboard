import React from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import WidgetFactory from './WidgetFactory';

const DashboardCanvas = ({ widgets, layout, onLayoutChange, onRemoveWidget }) => {
  const handleRemoveClick = (widgetId) => {
    onRemoveWidget(widgetId);
  };

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={100}
      width={1200}
      onLayoutChange={onLayoutChange}
      isDraggable={true}
      isResizable={true}
      compactType="vertical"
      preventCollision={false}
    >
      {widgets.map((widget) => (
        <div key={widget.id} className="widget-container">
          <div className="widget-content">
            <button
              className="remove-widget"
              onClick={() => handleRemoveClick(widget.id)}
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                padding: '2px 6px',
                cursor: 'pointer',
                fontSize: '12px',
                zIndex: 10,
              }}
            >
              ×
            </button>
            <WidgetFactory widget={widget} />
          </div>
        </div>
      ))}
    </GridLayout>
  );
};

export default DashboardCanvas;
