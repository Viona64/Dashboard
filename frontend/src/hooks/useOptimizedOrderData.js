import { useState, useEffect, useMemo, useCallback } from 'react';
import { ordersAPI } from '../services/api';

export const useOptimizedOrderData = (filters = {}) => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize filters to prevent unnecessary re-fetches
  const memoizedFilters = useMemo(() => filters, [filters]);

  const fetchOrderData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add pagination to limit initial data load
      const [ordersData, statsData, trendsData] = await Promise.all([
        ordersAPI.getOrders({ ...memoizedFilters, limit: 50 }), // Limit initial load
        ordersAPI.getOrderStats(memoizedFilters),
        ordersAPI.getOrderTrends({ ...memoizedFilters, period: 'monthly' })
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
  }, [memoizedFilters]);

  useEffect(() => {
    fetchOrderData();
  }, [fetchOrderData]);

  // Pre-computed aggregations with performance optimization
  const aggregations = useMemo(() => {
    if (!orders.length) return {
      totalRevenue: 0,
      totalOrders: 0,
      avgOrderValue: 0,
      revenueByProduct: {},
      ordersByStatus: {},
      monthlyRevenue: {},
      topProducts: [],
      recentOrders: [],
    };

    // Use for loop instead of reduce for better performance with large datasets
    let totalRevenue = 0;
    const revenueByProduct = {};
    const ordersByStatus = {};
    const monthlyRevenue = {};
    
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const amount = order.amount || 0;
      const product = order.product || 'Unknown';
      const status = order.status || 'Unknown';
      const month = order.order_date ? order.order_date.substring(0, 7) : 'Unknown';
      
      totalRevenue += amount;
      revenueByProduct[product] = (revenueByProduct[product] || 0) + amount;
      ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + amount;
    }
    
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const topProducts = Object.entries(revenueByProduct)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      revenueByProduct,
      ordersByStatus,
      monthlyRevenue,
      topProducts,
      recentOrders: orders.slice(0, 50), // Reduced from 100 for better performance
    };
  }, [orders]);

  const refetch = useCallback(() => {
    fetchOrderData();
  }, [fetchOrderData]);

  return {
    orders,
    stats,
    trends,
    loading,
    error,
    aggregations,
    refetch,
  };
};
