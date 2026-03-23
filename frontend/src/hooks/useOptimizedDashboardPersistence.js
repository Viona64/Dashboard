import { useState, useCallback } from 'react';
import { saveDashboardConfig, loadDashboardConfig, updateDashboardConfig } from '../services/dashboardService';

export const useOptimizedDashboardPersistence = (dashboardId = null) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDashboardId, setCurrentDashboardId] = useState(dashboardId);

  const saveDashboard = useCallback(async (dashboardData) => {
    try {
      setIsSaving(true);
      setError(null);
      
      let response;
      if (currentDashboardId) {
        response = await updateDashboardConfig(currentDashboardId, dashboardData);
      } else {
        response = await saveDashboardConfig(dashboardData);
        setCurrentDashboardId(response.id);
      }
      
      return response;
    } catch (err) {
      setError(err.message || 'Failed to save dashboard');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [currentDashboardId]);

  const loadDashboard = useCallback(async (dashboardIdToLoad = currentDashboardId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const dashboard = await loadDashboardConfig(dashboardIdToLoad);
      
      if (dashboard) {
        setCurrentDashboardId(dashboard.id);
        return dashboard;
      }
      
      return null;
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentDashboardId]);

  const createNewDashboard = useCallback(async (dashboardData) => {
    try {
      setIsSaving(true);
      setError(null);
      
      const response = await saveDashboardConfig(dashboardData);
      setCurrentDashboardId(response.id);
      
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create dashboard');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    saveDashboard,
    loadDashboard,
    createNewDashboard,
    isSaving,
    isLoading,
    error,
    currentDashboardId,
    setCurrentDashboardId,
  };
};
