export const calculateTotalRevenue = (orders) => {
  return orders.reduce((total, order) => total + parseFloat(order.amount || 0), 0);
};

export const countOrders = (orders) => {
  return orders.length;
};

export const groupDataByProduct = (orders) => {
  const productGroups = orders.reduce((acc, order) => {
    const product = order.product || 'Unknown';
    if (!acc[product]) {
      acc[product] = {
        product,
        count: 0,
        revenue: 0,
      };
    }
    acc[product].count += 1;
    acc[product].revenue += parseFloat(order.amount || 0);
    return acc;
  }, {});
  
  return Object.values(productGroups).sort((a, b) => b.revenue - a.revenue);
};

export const groupDataByStatus = (orders) => {
  const statusGroups = orders.reduce((acc, order) => {
    const status = order.status || 'Unknown';
    if (!acc[status]) {
      acc[status] = {
        status,
        count: 0,
        revenue: 0,
      };
    }
    acc[status].count += 1;
    acc[status].revenue += parseFloat(order.amount || 0);
    return acc;
  }, {});
  
  return Object.values(statusGroups);
};

export const groupDataByCustomer = (orders) => {
  const customerGroups = orders.reduce((acc, order) => {
    const customerName = order.customer_name || 'Unknown';
    if (!acc[customerName]) {
      acc[customerName] = {
        customer: customerName,
        count: 0,
        revenue: 0,
        orders: [],
      };
    }
    acc[customerName].count += 1;
    acc[customerName].revenue += parseFloat(order.amount || 0);
    acc[customerName].orders.push(order);
    return acc;
  }, {});
  
  return Object.values(customerGroups).sort((a, b) => b.revenue - a.revenue);
};

export const getMonthlyRevenue = (orders) => {
  const monthlyData = orders.reduce((acc, order) => {
    const date = new Date(order.order_date || order.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        revenue: 0,
        count: 0,
      };
    }
    acc[monthKey].revenue += parseFloat(order.amount || 0);
    acc[monthKey].count += 1;
    return acc;
  }, {});
  
  return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US').format(number);
};

export const getAverageOrderValue = (orders) => {
  if (orders.length === 0) return 0;
  const totalRevenue = calculateTotalRevenue(orders);
  return totalRevenue / orders.length;
};

export const getTopProducts = (orders, limit = 5) => {
  return groupDataByProduct(orders).slice(0, limit);
};

export const getOrdersByDateRange = (orders, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return orders.filter(order => {
    const orderDate = new Date(order.order_date || order.created_at);
    return orderDate >= start && orderDate <= end;
  });
};
