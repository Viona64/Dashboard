export const calculateTotalRevenue = (orders) => {
  return orders.reduce((total, order) => total + parseFloat(order.amount || order.total_amount || 0), 0);
};

export const calculateAverageOrderValue = (orders) => {
  if (orders.length === 0) return 0;
  return calculateTotalRevenue(orders) / orders.length;
};

export const calculateTotalOrders = (orders) => {
  return orders.length;
};

export const calculateRevenueByProduct = (orders) => {
  const productRevenue = orders.reduce((acc, order) => {
    const product = order.product || 'Unknown';
    const amount = parseFloat(order.amount || order.total_amount || 0);
    
    if (!acc[product]) {
      acc[product] = 0;
    }
    acc[product] += amount;
    return acc;
  }, {});
  
  return Object.entries(productRevenue)
    .map(([product, revenue]) => ({ product, revenue }))
    .sort((a, b) => b.revenue - a.revenue);
};

export const calculateOrderCountByStatus = (orders) => {
  const statusCount = orders.reduce((acc, order) => {
    const status = order.status || 'Unknown';
    
    if (!acc[status]) {
      acc[status] = 0;
    }
    acc[status] += 1;
    return acc;
  }, {});
  
  return Object.entries(statusCount)
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);
};

export const calculateRevenueTrendOverTime = (orders, groupBy = 'day') => {
  const groupedData = orders.reduce((acc, order) => {
    const date = new Date(order.created_at || order.order_date);
    let key;
    
    switch (groupBy) {
      case 'day':
        key = date.toISOString().split('T')[0];
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      default:
        key = date.toISOString().split('T')[0];
    }
    
    if (!acc[key]) {
      acc[key] = { date: key, revenue: 0, orders: 0 };
    }
    
    acc[key].revenue += parseFloat(order.amount || order.total_amount || 0);
    acc[key].orders += 1;
    
    return acc;
  }, {});
  
  return Object.values(groupedData).sort((a, b) => a.date.localeCompare(b.date));
};

export const calculatePeriodComparison = (currentPeriod, previousPeriod) => {
  const currentRevenue = calculateTotalRevenue(currentPeriod);
  const previousRevenue = calculateTotalRevenue(previousPeriod);
  const currentOrders = calculateTotalOrders(currentPeriod);
  const previousOrders = calculateTotalOrders(previousPeriod);
  
  const revenueChange = previousRevenue === 0 ? 0 : ((currentRevenue - previousRevenue) / previousRevenue) * 100;
  const ordersChange = previousOrders === 0 ? 0 : ((currentOrders - previousOrders) / previousOrders) * 100;
  
  return {
    revenueChange,
    ordersChange,
    currentRevenue,
    previousRevenue,
    currentOrders,
    previousOrders,
  };
};

export const calculateGrowthRate = (orders, period = 'month') => {
  const trendData = calculateRevenueTrendOverTime(orders, period);
  
  if (trendData.length < 2) return 0;
  
  const firstPeriod = trendData[0];
  const lastPeriod = trendData[trendData.length - 1];
  
  if (firstPeriod.revenue === 0) return 0;
  
  return ((lastPeriod.revenue - firstPeriod.revenue) / firstPeriod.revenue) * 100;
};

export const getTopPerformingProducts = (orders, limit = 5) => {
  return calculateRevenueByProduct(orders).slice(0, limit);
};

export const getMostCommonStatus = (orders) => {
  const statusCounts = calculateOrderCountByStatus(orders);
  return statusCounts[0] || { status: 'Unknown', count: 0 };
};
