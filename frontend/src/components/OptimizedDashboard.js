import React, { useState, useEffect, useCallback, useMemo } from 'react';
import WidgetPanel from './WidgetPanel';
import DashboardCanvas from './DashboardCanvas';
import { useOptimizedDashboardPersistence } from '../hooks/useOptimizedDashboardPersistence';
import { useOptimizedDashboardState } from '../hooks/useOptimizedDashboardState';
import { DataLoadingState, DataErrorState } from './common/LoadingStates';
import { OrderDataProvider } from '../contexts/OrderDataContext';

const OptimizedDashboard = () => {
  const [dashboardName, setDashboardName] = useState('My Dashboard');
  const { widgets, layout, addWidget, removeWidget, updateLayout } = useOptimizedDashboardState();
  const { 
    saveDashboard, 
    loadDashboard, 
    isSaving, 
    isLoading, 
    error,
    currentDashboardId 
  } = useOptimizedDashboardPersistence();

  // Memoize dashboard initialization to prevent infinite loops
  const initializeDashboard = useCallback(async () => {
    try {
      const savedDashboard = await loadDashboard();
      
      if (savedDashboard && savedDashboard.layout_config) {
        const config = savedDashboard.layout_config;
        setDashboardName(savedDashboard.name);
        
        if (config.widgets) {
          // Batch widget additions for performance
          config.widgets.forEach(widget => {
            addWidget(widget.type, widget);
          });
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    }
  }, [loadDashboard, addWidget]);

  // Only run initialization once on mount
  useEffect(() => {
    initializeDashboard();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - run only once

  // Memoize event handlers
  const handleAddWidget = useCallback((widgetType) => {
    addWidget(widgetType);
  }, [addWidget]);

  const handleLayoutChange = useCallback((newLayout) => {
    updateLayout(newLayout);
  }, [updateLayout]);

  const handleRemoveWidget = useCallback((widgetId) => {
    removeWidget(widgetId);
  }, [removeWidget]);

  const handleSaveLayout = useCallback(async () => {
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
  }, [dashboardName, widgets, layout, saveDashboard]);

  // Memoize dashboard data to prevent unnecessary re-renders
  const dashboardData = useMemo(() => ({
    widgets,
    layout,
    dashboardName,
    currentDashboardId,
    isSaving,
  }), [widgets, layout, dashboardName, currentDashboardId, isSaving]);

  if (isLoading) {
    return <DataLoadingState message="Loading dashboard..." />;
  }

  if (error) {
    return <DataErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <OrderDataProvider>
      <div className="dashboard-container">
        <WidgetPanel onAddWidget={handleAddWidget} />
        <div className="dashboard-canvas">
          <div className="canvas-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="text"
                value={dashboardData.dashboardName}
                onChange={(e) => setDashboardName(e.target.value)}
                style={{
                  fontSize: '24px',
                  border: 'none',
                  background: 'transparent',
                  color: '#212529',
                  padding: '5px',
                }}
              />
              {dashboardData.currentDashboardId && (
                <span style={{ fontSize: '12px', color: '#6c757d' }}>
                  ID: {dashboardData.currentDashboardId}
                </span>
              )}
            </div>
            <button 
              className="save-button" 
              onClick={handleSaveLayout}
              disabled={dashboardData.isSaving}
              style={{
                opacity: dashboardData.isSaving ? 0.6 : 1,
                cursor: dashboardData.isSaving ? 'not-allowed' : 'pointer',
              }}
            >
              {dashboardData.isSaving ? 'Saving...' : 'Save Layout'}
            </button>
          </div>
          <DashboardCanvas
            widgets={dashboardData.widgets}
            layout={dashboardData.layout}
            onLayoutChange={handleLayoutChange}
            onRemoveWidget={handleRemoveWidget}
          />
        </div>
      </div>
    </OrderDataProvider>
  );
};

export default OptimizedDashboard;
