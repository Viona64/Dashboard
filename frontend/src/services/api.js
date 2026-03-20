import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ordersAPI = {
  getOrders: async (params = {}) => {
    const response = await api.get('/api/orders/', { params });
    return response.data;
  },
  
  getOrderStats: async (params = {}) => {
    const response = await api.get('/api/orders/stats/', { params });
    return response.data;
  },
  
  getOrderTrends: async (params = {}) => {
    const response = await api.get('/api/orders/trends/', { params });
    return response.data;
  },
};

export const dashboardAPI = {
  getDashboards: async () => {
    const response = await api.get('/api/dashboard/');
    return response.data;
  },
  
  createDashboard: async (data) => {
    const response = await api.post('/api/dashboard/', data);
    return response.data;
  },
  
  updateDashboard: async (id, data) => {
    const response = await api.put(`/api/dashboard/${id}/`, data);
    return response.data;
  },
  
  deleteDashboard: async (id) => {
    const response = await api.delete(`/api/dashboard/${id}/`);
    return response.data;
  },
  
  getWidgetData: async (dashboardId, widgetConfig, params = {}) => {
    const response = await api.get(`/api/dashboard/${dashboardId}/widget_data/`, {
      params: { widget_config: JSON.stringify(widgetConfig), ...params }
    });
    return response.data;
  },
};

export default api;
