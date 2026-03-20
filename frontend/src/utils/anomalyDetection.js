import { calculateRevenueTrendOverTime, calculateTotalOrders, calculateTotalRevenue } from './dataAnalysis';

export const detectAnomalies = (orders, threshold = 0.5) => {
  const dailyTrend = calculateRevenueTrendOverTime(orders, 'day');
  const anomalies = [];
  
  if (dailyTrend.length < 7) return anomalies;
  
  const recentDays = dailyTrend.slice(-7);
  const olderDays = dailyTrend.slice(0, -7);
  
  if (olderDays.length === 0) return anomalies;
  
  const avgRevenue = olderDays.reduce((sum, day) => sum + day.revenue, 0) / olderDays.length;
  const avgOrders = olderDays.reduce((sum, day) => sum + day.orders, 0) / olderDays.length;
  
  recentDays.forEach(day => {
    const revenueChange = avgRevenue === 0 ? 0 : (day.revenue - avgRevenue) / avgRevenue;
    const ordersChange = avgOrders === 0 ? 0 : (day.orders - avgOrders) / avgOrders;
    
    if (Math.abs(revenueChange) > threshold) {
      anomalies.push({
        type: 'revenue',
        date: day.date,
        value: day.revenue,
        expected: avgRevenue,
        change: revenueChange,
        severity: Math.abs(revenueChange) > 0.8 ? 'high' : 'medium',
        direction: revenueChange > 0 ? 'spike' : 'drop'
      });
    }
    
    if (Math.abs(ordersChange) > threshold) {
      anomalies.push({
        type: 'orders',
        date: day.date,
        value: day.orders,
        expected: avgOrders,
        change: ordersChange,
        severity: Math.abs(ordersChange) > 0.8 ? 'high' : 'medium',
        direction: ordersChange > 0 ? 'spike' : 'drop'
      });
    }
  });
  
  return anomalies;
};

export const detectOutliers = (values, threshold = 2) => {
  if (values.length < 3) return [];
  
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  return values
    .map((value, index) => ({
      index,
      value,
      zScore: Math.abs((value - mean) / stdDev)
    }))
    .filter(item => item.zScore > threshold);
};

export const detectTrendAnomalies = (orders) => {
  const dailyTrend = calculateRevenueTrendOverTime(orders, 'day');
  const anomalies = [];
  
  if (dailyTrend.length < 14) return anomalies;
  
  for (let i = 7; i < dailyTrend.length; i++) {
    const currentWeek = dailyTrend.slice(i - 7, i);
    const previousWeek = dailyTrend.slice(i - 14, i - 7);
    
    const currentRevenue = currentWeek.reduce((sum, day) => sum + day.revenue, 0);
    const previousRevenue = previousWeek.reduce((sum, day) => sum + day.revenue, 0);
    
    const change = previousRevenue === 0 ? 0 : (currentRevenue - previousRevenue) / previousRevenue;
    
    if (Math.abs(change) > 0.3) {
      anomalies.push({
        type: 'weekly_trend',
        startDate: currentWeek[0].date,
        endDate: currentWeek[currentWeek.length - 1].date,
        change,
        severity: Math.abs(change) > 0.5 ? 'high' : 'medium',
        direction: change > 0 ? 'increase' : 'decrease'
      });
    }
  }
  
  return anomalies;
};

export const getAnomalySummary = (anomalies) => {
  if (anomalies.length === 0) {
    return { hasAnomalies: false, message: 'No anomalies detected' };
  }
  
  const highSeverity = anomalies.filter(a => a.severity === 'high');
  const revenueAnomalies = anomalies.filter(a => a.type === 'revenue' || a.type === 'weekly_trend');
  const orderAnomalies = anomalies.filter(a => a.type === 'orders');
  
  return {
    hasAnomalies: true,
    totalAnomalies: anomalies.length,
    highSeverityCount: highSeverity.length,
    revenueAnomaliesCount: revenueAnomalies.length,
    orderAnomaliesCount: orderAnomalies.length,
    mostRecent: anomalies[anomalies.length - 1],
    summary: `Detected ${anomalies.length} anomalies (${highSeverity.length} high severity)`
  };
};
