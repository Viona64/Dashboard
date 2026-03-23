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
    
    // Handle different response structures safely
    let dashboards = [];
    if (response && typeof response === 'object') {
      if (response.data) {
        if (response.data.results && Array.isArray(response.data.results)) {
          dashboards = response.data.results;
        } else if (Array.isArray(response.data)) {
          dashboards = response.data;
        }
      }
    } else if (Array.isArray(response)) {
      dashboards = response;
    }
    
    if (dashboardId) {
      const dashboard = dashboards.find(d => d && d.id === dashboardId);
      return dashboard || null;
    }
    
    return dashboards[0] || null;
  } catch (error) {
    console.error('Error loading dashboard config:', error);
    // Return null on error to prevent infinite loops
    return null;
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
