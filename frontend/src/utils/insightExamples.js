import { generateAllInsights, detectAnomalies } from '../utils/insightGenerator';

const sampleOrders = [
  { id: 1, amount: 100, product: 'Laptop', status: 'delivered', created_at: '2023-10-01' },
  { id: 2, amount: 50, product: 'Mouse', status: 'pending', created_at: '2023-10-01' },
  { id: 3, amount: 200, product: 'Laptop', status: 'delivered', created_at: '2023-10-02' },
  { id: 4, amount: 75, product: 'Keyboard', status: 'shipped', created_at: '2023-10-02' },
  { id: 5, amount: 150, product: 'Monitor', status: 'pending', created_at: '2023-10-03' },
  { id: 6, amount: 300, product: 'Laptop', status: 'delivered', created_at: '2023-10-04' },
  { id: 7, amount: 25, product: 'Mouse', status: 'cancelled', created_at: '2023-10-04' },
  { id: 8, amount: 180, product: 'Monitor', status: 'delivered', created_at: '2023-10-05' },
  { id: 9, amount: 90, product: 'Keyboard', status: 'shipped', created_at: '2023-10-06' },
  { id: 10, amount: 220, product: 'Laptop', status: 'pending', created_at: '2023-10-07' },
];

const highVolumeOrders = [
  ...sampleOrders,
  { id: 11, amount: 500, product: 'Laptop', status: 'delivered', created_at: '2023-10-08' },
  { id: 12, amount: 450, product: 'Monitor', status: 'delivered', created_at: '2023-10-08' },
  { id: 13, amount: 380, product: 'Laptop', status: 'delivered', created_at: '2023-10-08' },
];

const anomalyOrders = [
  ...sampleOrders,
  { id: 11, amount: 5, product: 'Mouse', status: 'delivered', created_at: '2023-10-08' },
  { id: 12, amount: 3, product: 'Keyboard', status: 'delivered', created_at: '2023-10-08' },
  { id: 13, amount: 2, product: 'Mouse', status: 'delivered', created_at: '2023-10-08' },
];

console.log('=== Sample Order Data Analysis ===');
console.log('Sample orders:', sampleOrders.length);

console.log('\n=== Revenue Insights ===');
const revenueInsights = generateAllInsights(sampleOrders).filter(i => i.type === 'revenue');
revenueInsights.forEach(insight => {
  console.log(`${insight.priority}: ${insight.text}`);
});

console.log('\n=== Order Status Insights ===');
const orderInsights = generateAllInsights(sampleOrders).filter(i => i.type === 'orders');
orderInsights.forEach(insight => {
  console.log(`${insight.priority}: ${insight.text}`);
});

console.log('\n=== Trend Insights ===');
const trendInsights = generateAllInsights(sampleOrders).filter(i => i.type === 'trend');
trendInsights.forEach(insight => {
  console.log(`${insight.priority}: ${insight.text}`);
});

console.log('\n=== Product Insights ===');
const productInsights = generateAllInsights(sampleOrders).filter(i => i.type === 'product');
productInsights.forEach(insight => {
  console.log(`${insight.priority}: ${insight.text}`);
});

console.log('\n=== High Volume Scenario ===');
const highVolumeInsights = generateAllInsights(highVolumeOrders);
console.log(`Generated ${highVolumeInsights.length} insights for high volume scenario`);
highVolumeInsights.slice(0, 3).forEach(insight => {
  console.log(`${insight.priority}: ${insight.text}`);
});

console.log('\n=== Anomaly Detection ===');
const anomalies = detectAnomalies(anomalyOrders, 0.5);
console.log(`Detected ${anomalies.length} anomalies:`);
anomalies.forEach(anomaly => {
  console.log(`- ${anomaly.type} ${anomaly.direction} on ${anomaly.date}: ${anomaly.change.toFixed(1)}% change (${anomaly.severity} severity)`);
});

console.log('\n=== Complete Insights Summary ===');
const allInsights = generateAllInsights(sampleOrders);
console.log(`Total insights generated: ${allInsights.length}`);
allInsights.forEach((insight, index) => {
  console.log(`${index + 1}. [${insight.priority.toUpperCase()}] ${insight.text} (${insight.trend} trend)`);
});

console.log('\n=== Example Widget-Specific Insights ===');
console.log('KPI Widget Insights:');
const kpiInsights = generateAllInsights(sampleOrders).filter(i => i.type === 'revenue').slice(0, 2);
kpiInsights.forEach(insight => console.log(`  - ${insight.text}`));

console.log('Bar Chart Widget Insights:');
const barInsights = generateAllInsights(sampleOrders).filter(i => i.type === 'product').slice(0, 2);
barInsights.forEach(insight => console.log(`  - ${insight.text}`));

console.log('Pie Chart Widget Insights:');
const pieInsights = generateAllInsights(sampleOrders).filter(i => i.type === 'orders').slice(0, 2);
pieInsights.forEach(insight => console.log(`  - ${insight.text}`));

console.log('Line Chart Widget Insights:');
const lineInsights = generateAllInsights(sampleOrders).filter(i => i.type === 'trend').slice(0, 2);
lineInsights.forEach(insight => console.log(`  - ${insight.text}`));
