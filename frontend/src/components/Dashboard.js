import React, { useState, useEffect } from 'react';
import WidgetPanel from './WidgetPanel';
import DashboardCanvas from './DashboardCanvas';
import { useDashboardPersistence } from '../hooks/useDashboardPersistence';
import { useDashboardState } from '../hooks/useDashboardState';
import { DataLoadingState, DataErrorState } from './common/LoadingStates';

const Dashboard = () => {
  const [dashboardName, setDashboardName] = useState('My Dashboard');
  const { widgets, layout, addWidget, removeWidget, updateLayout } = useDashboardState();
  const { 
    saveDashboard, 
    loadDashboard, 
    isSaving, 
    isLoading, 
    error,
    currentDashboardId 
  } = useDashboardPersistence();

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const savedDashboard = await loadDashboard();
        if (savedDashboard && savedDashboard.layout_config) {
          const config = savedDashboard.layout_config;
          setDashboardName(savedDashboard.name);
          
          if (config.widgets) {
            config.widgets.forEach(widget => addWidget(widget.type, widget));
          }
        } else {
          // Create default dashboard if none exists
          console.log('No saved dashboard found, starting with empty dashboard');
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        console.log('Starting with empty dashboard');
      }
    };

    initializeDashboard();
  }, []);

  const handleAddWidget = (widgetType) => {
    addWidget(widgetType);
  };

  const handleLayoutChange = (newLayout) => {
    updateLayout(newLayout);
  };

  const handleRemoveWidget = (widgetId) => {
    removeWidget(widgetId);
  };

  const handleSaveLayout = async () => {
    try {
      const dashboardData = {
        name: dashboardName,
        widgets,
        layout,
        grid: { cols: 12, rowHeight: 100 },
      };

      await saveDashboard(dashboardData);
      alert('Dashboard saved successfully!');
    } catch (err) {
      alert('Failed to save dashboard: ' + err.message);
    }
  };

  if (isLoading) {
    return <DataLoadingState message="Loading dashboard..." />;
  }

  if (error) {
    return <DataErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="dashboard-container">
      <WidgetPanel onAddWidget={handleAddWidget} />
      <div className="dashboard-canvas">
        <div className="canvas-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="text"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              style={{
                fontSize: '24px',
                border: 'none',
                background: 'transparent',
                color: '#212529',
                padding: '5px',
              }}
            />
            {currentDashboardId && (
              <span style={{ fontSize: '12px', color: '#6c757d' }}>
                ID: {currentDashboardId}
              </span>
            )}
          </div>
          <button 
            className="save-button" 
            onClick={handleSaveLayout}
            disabled={isSaving}
            style={{
              opacity: isSaving ? 0.6 : 1,
              cursor: isSaving ? 'not-allowed' : 'pointer',
            }}
          >
            {isSaving ? 'Saving...' : 'Save Layout'}
          </button>
        </div>
        <DashboardCanvas
          widgets={widgets}
          layout={layout}
          onLayoutChange={handleLayoutChange}
          onRemoveWidget={handleRemoveWidget}
        />
      </div>
    </div>
  );
};

export default Dashboard;
