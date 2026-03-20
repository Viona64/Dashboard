import React, { useState, useEffect } from 'react';

export const useDashboardState = () => {
  const [widgets, setWidgets] = useState([]);
  const [layout, setLayout] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addWidget = (widgetType, existingWidget = null) => {
    const newWidget = existingWidget || {
      id: `${widgetType}-${Date.now()}`,
      type: widgetType,
      title: widgetType.charAt(0).toUpperCase() + widgetType.slice(1),
      config: {},
    };

    if (!existingWidget) {
      const defaultSizes = {
        kpi: { w: 3, h: 2 },
        bar: { w: 6, h: 4 },
        line: { w: 6, h: 4 },
        pie: { w: 4, h: 4 },
        table: { w: 8, h: 4 },
      };

      const size = defaultSizes[widgetType] || { w: 4, h: 2 };

      const newLayoutItem = {
        i: newWidget.id,
        x: (widgets.length * size.w) % 12,
        y: Math.floor((widgets.length * size.w) / 12) * size.h,
        w: size.w,
        h: size.h,
      };

      setLayout([...layout, newLayoutItem]);
    }

    setWidgets([...widgets, newWidget]);
  };

  const removeWidget = (widgetId) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
    setLayout(layout.filter(item => item.i !== widgetId));
  };

  const updateLayout = (newLayout) => {
    setLayout(newLayout);
  };

  const updateWidgetConfig = (widgetId, config) => {
    setWidgets(widgets.map(w => 
      w.id === widgetId ? { ...w, config } : w
    ));
  };

  const saveDashboard = () => {
    const dashboardConfig = {
      widgets,
      layout,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem('dashboardConfig', JSON.stringify(dashboardConfig));
    return dashboardConfig;
  };

  const loadDashboard = () => {
    setIsLoading(true);
    const savedConfig = localStorage.getItem('dashboardConfig');
    
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setWidgets(config.widgets || []);
        setLayout(config.layout || []);
      } catch (error) {
        console.error('Error loading dashboard config:', error);
      }
    }
    
    setIsLoading(false);
  };

  const clearDashboard = () => {
    setWidgets([]);
    setLayout([]);
    localStorage.removeItem('dashboardConfig');
  };

  const setDashboardFromConfig = (config) => {
    if (config.widgets) {
      setWidgets(config.widgets);
    }
    if (config.layout) {
      setLayout(config.layout);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return {
    widgets,
    layout,
    isLoading,
    addWidget,
    removeWidget,
    updateLayout,
    updateWidgetConfig,
    saveDashboard,
    loadDashboard,
    clearDashboard,
    setDashboardFromConfig,
  };
};
