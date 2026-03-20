import {
  calculateTotalRevenue,
  calculateAverageOrderValue,
  calculateTotalOrders,
  calculateRevenueByProduct,
  calculateOrderCountByStatus,
  calculateRevenueTrendOverTime,
  calculatePeriodComparison,
  calculateGrowthRate,
  getTopPerformingProducts,
  getMostCommonStatus
} from './dataAnalysis';
import { detectAnomalies, getAnomalySummary } from './anomalyDetection';

export const generateRevenueInsights = (orders) => {
  const insights = [];
  const totalRevenue = calculateTotalRevenue(orders);
  const avgOrderValue = calculateAverageOrderValue(orders);
  const topProducts = getTopPerformingProducts(orders, 3);
  const revenueTrend = calculateRevenueTrendOverTime(orders, 'day');
  
  if (topProducts.length > 0) {
    const topProduct = topProducts[0];
    const contribution = (topProduct.revenue / totalRevenue) * 100;
    insights.push({
      type: 'revenue',
      priority: 'high',
      text: `${topProduct.product} contributes ${contribution.toFixed(1)}% of total revenue`,
      value: contribution,
      trend: 'positive'
    });
  }
  
  if (revenueTrend.length >= 2) {
    const recentPeriod = revenueTrend.slice(-7);
    const previousPeriod = revenueTrend.slice(-14, -7);
    
    if (previousPeriod.length > 0) {
      const comparison = calculatePeriodComparison(recentPeriod, previousPeriod);
      if (Math.abs(comparison.revenueChange) > 10) {
        insights.push({
          type: 'revenue',
          priority: 'medium',
          text: `Revenue ${comparison.revenueChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(comparison.revenueChange).toFixed(1)}% compared to previous period`,
          value: comparison.revenueChange,
          trend: comparison.revenueChange > 0 ? 'positive' : 'negative'
        });
      }
    }
  }
  
  if (avgOrderValue > 0) {
    insights.push({
      type: 'revenue',
      priority: 'low',
      text: `Average order value is $${avgOrderValue.toFixed(2)}`,
      value: avgOrderValue,
      trend: 'neutral'
    });
  }
  
  return insights;
};

export const generateOrderInsights = (orders) => {
  const insights = [];
  const totalOrders = calculateTotalOrders(orders);
  const mostCommonStatus = getMostCommonStatus(orders);
  const statusDistribution = calculateOrderCountByStatus(orders);
  
  if (mostCommonStatus.status !== 'Unknown') {
    const percentage = (mostCommonStatus.count / totalOrders) * 100;
    insights.push({
      type: 'orders',
      priority: 'high',
      text: `${percentage.toFixed(1)}% of orders are in ${mostCommonStatus.status} status`,
      value: percentage,
      trend: 'neutral'
    });
  }
  
  const pendingOrders = statusDistribution.find(s => s.status.toLowerCase() === 'pending');
  if (pendingOrders && pendingOrders.count > 0) {
    insights.push({
      type: 'orders',
      priority: 'medium',
      text: `${pendingOrders.count} orders are pending attention`,
      value: pendingOrders.count,
      trend: 'negative'
    });
  }
  
  if (totalOrders > 0) {
    insights.push({
      type: 'orders',
      priority: 'low',
      text: `Total of ${totalOrders} orders processed`,
      value: totalOrders,
      trend: 'neutral'
    });
  }
  
  return insights;
};

export const generateTrendInsights = (orders) => {
  const insights = [];
  const growthRate = calculateGrowthRate(orders, 'month');
  const anomalies = detectAnomalies(orders, 0.5);
  const anomalySummary = getAnomalySummary(anomalies);
  
  if (Math.abs(growthRate) > 5) {
    insights.push({
      type: 'trend',
      priority: 'high',
      text: `Monthly growth rate is ${growthRate > 0 ? '+' : ''}${growthRate.toFixed(1)}%`,
      value: growthRate,
      trend: growthRate > 0 ? 'positive' : 'negative'
    });
  }
  
  if (anomalySummary.hasAnomalies) {
    insights.push({
      type: 'anomaly',
      priority: 'high',
      text: `${anomalySummary.summary}`,
      value: anomalySummary.totalAnomalies,
      trend: 'negative'
    });
  }
  
  const dailyTrend = calculateRevenueTrendOverTime(orders, 'day');
  if (dailyTrend.length >= 7) {
    const lastWeek = dailyTrend.slice(-7);
    const avgDailyRevenue = lastWeek.reduce((sum, day) => sum + day.revenue, 0) / lastWeek.length;
    
    insights.push({
      type: 'trend',
      priority: 'medium',
      text: `Average daily revenue (last 7 days): $${avgDailyRevenue.toFixed(2)}`,
      value: avgDailyRevenue,
      trend: 'neutral'
    });
  }
  
  return insights;
};

export const generateProductInsights = (orders) => {
  const insights = [];
  const productRevenue = calculateRevenueByProduct(orders);
  const topProducts = getTopPerformingProducts(orders, 5);
  
  if (productRevenue.length > 1) {
    const topProduct = productRevenue[0];
    const secondProduct = productRevenue[1];
    const difference = ((topProduct.revenue - secondProduct.revenue) / secondProduct.revenue) * 100;
    
    insights.push({
      type: 'product',
      priority: 'medium',
      text: `${topProduct.product} leads with ${difference.toFixed(1)}% more revenue than ${secondProduct.product}`,
      value: difference,
      trend: 'positive'
    });
  }
  
  if (topProducts.length >= 3) {
    const top3Revenue = topProducts.slice(0, 3).reduce((sum, p) => sum + p.revenue, 0);
    const totalRevenue = calculateTotalRevenue(orders);
    const concentration = (top3Revenue / totalRevenue) * 100;
    
    insights.push({
      type: 'product',
      priority: 'medium',
      text: `Top 3 products generate ${concentration.toFixed(1)}% of total revenue`,
      value: concentration,
      trend: concentration > 70 ? 'negative' : 'positive'
    });
  }
  
  return insights;
};

export const generateAllInsights = (orders) => {
  const allInsights = [
    ...generateRevenueInsights(orders),
    ...generateOrderInsights(orders),
    ...generateTrendInsights(orders),
    ...generateProductInsights(orders)
  ];
  
  return allInsights
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    })
    .slice(0, 5);
};

export const getInsightForWidget = (orders, widgetType) => {
  switch (widgetType) {
    case 'kpi':
      return generateRevenueInsights(orders);
    case 'bar':
      return generateProductInsights(orders);
    case 'line':
      return generateTrendInsights(orders);
    case 'pie':
      return generateOrderInsights(orders);
    default:
      return generateAllInsights(orders);
  }
};
