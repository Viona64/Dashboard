import { useState, useCallback, useMemo } from 'react';

export const useOptimizedDashboardState = () => {
  const [widgets, setWidgets] = useState([]);
  const [layout, setLayout] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Memoize default sizes to prevent recreation
  const defaultSizes = useMemo(() => ({
    kpi: { w: 3, h: 2 },
    bar: { w: 6, h: 4 },
    line: { w: 6, h: 4 },
    pie: { w: 4, h: 4 },
    table: { w: 8, h: 4 },
  }), []);

  const addWidget = useCallback((widgetType, existingWidget = null) => {
    const newWidget = existingWidget || {
      id: `${widgetType}-${Date.now()}`,
      type: widgetType,
      title: widgetType.charAt(0).toUpperCase() + widgetType.slice(1),
      config: {},
    };

    if (!existingWidget) {
      const size = defaultSizes[widgetType] || { w: 4, h: 2 };
      
      // Use current widgets value instead of dependency
      setWidgets(currentWidgets => {
        const x = (currentWidgets.length * size.w) % 12;
        const y = Math.floor((currentWidgets.length * size.w) / 12) * size.h;

        const newLayoutItem = {
          i: newWidget.id,
          x,
          y,
          w: size.w,
          h: size.h,
        };

        setLayout(currentLayout => [...currentLayout, newLayoutItem]);
        return [...currentWidgets, newWidget];
      });
    } else {
      setWidgets(prev => [...prev, newWidget]);
    }
  }, [defaultSizes]);

  const removeWidget = useCallback((widgetId) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
    setLayout(prev => prev.filter(item => item.i !== widgetId));
  }, []);

  const updateLayout = useCallback((newLayout) => {
    setLayout(newLayout);
  }, []);

  const updateWidgetConfig = useCallback((widgetId, config) => {
    setWidgets(prev => prev.map(w => 
      w.id === widgetId ? { ...w, config } : w
    ));
  }, []);

  const saveDashboard = useCallback(() => {
    const dashboardConfig = {
      widgets,
      layout,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem('dashboardConfig', JSON.stringify(dashboardConfig));
    return dashboardConfig;
  }, [widgets, layout]);

  const loadDashboard = useCallback(() => {
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
  }, []);

  const clearDashboard = useCallback(() => {
    setWidgets([]);
    setLayout([]);
    localStorage.removeItem('dashboardConfig');
  }, []);

  const setDashboardFromConfig = useCallback((config) => {
    if (config.widgets) {
      setWidgets(config.widgets);
    }
    if (config.layout) {
      setLayout(config.layout);
    }
  }, []);

  // Memoize return value to prevent unnecessary re-renders
  const dashboardState = useMemo(() => ({
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
  }), [
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
  ]);

  return dashboardState;
};
