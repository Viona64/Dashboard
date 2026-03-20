import { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';

export const useOrderData = (filters = {}) => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrderData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [ordersData, statsData, trendsData] = await Promise.all([
        ordersAPI.getOrders(filters),
        ordersAPI.getOrderStats(filters),
        ordersAPI.getOrderTrends({ ...filters, period: 'monthly' })
      ]);
      
      setOrders(ordersData.results || ordersData);
      setStats(statsData);
      setTrends(trendsData);
    } catch (err) {
      setError(err.message || 'Failed to fetch order data');
      console.error('Error fetching order data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [JSON.stringify(filters)]);

  const refetch = () => {
    fetchOrderData();
  };

  return {
    orders,
    stats,
    trends,
    loading,
    error,
    refetch,
  };
};
