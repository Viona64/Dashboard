import { dashboardAPI } from './api';

export const saveDashboardConfig = async (dashboardData) => {
  try {
    const config = {
      name: dashboardData.name || 'Default Dashboard',
      layout_config: {
        widgets: dashboardData.widgets,
        layout: dashboardData.layout,
        grid: dashboardData.grid || { cols: 12, rowHeight: 100 },
      },
    };

    const response = await dashboardAPI.createDashboard(config);
    return response.data;
  } catch (error) {
    console.error('Error saving dashboard config:', error);
    throw error;
  }
};

export const loadDashboardConfig = async (dashboardId) => {
  try {
    const response = await dashboardAPI.getDashboards();
    const dashboards = response.data.results || response.data || [];
    
    if (dashboardId) {
      const dashboard = dashboards.find(d => d.id === dashboardId);
      return dashboard;
    }
    
    return dashboards[0] || null;
  } catch (error) {
    console.error('Error loading dashboard config:', error);
    throw error;
  }
};

export const updateDashboardConfig = async (dashboardId, dashboardData) => {
  try {
    const config = {
      name: dashboardData.name || 'Default Dashboard',
      layout_config: {
        widgets: dashboardData.widgets,
        layout: dashboardData.layout,
        grid: dashboardData.grid || { cols: 12, rowHeight: 100 },
      },
    };

    const response = await dashboardAPI.updateDashboard(dashboardId, config);
    return response.data;
  } catch (error) {
    console.error('Error updating dashboard config:', error);
    throw error;
  }
};

export const getAllDashboards = async () => {
  try {
    const response = await dashboardAPI.getDashboards();
    return response.data.results || response.data || [];
  } catch (error) {
    console.error('Error fetching dashboards:', error);
    throw error;
  }
};

export const deleteDashboard = async (dashboardId) => {
  try {
    await dashboardAPI.deleteDashboard(dashboardId);
    return true;
  } catch (error) {
    console.error('Error deleting dashboard:', error);
    throw error;
  }
};
