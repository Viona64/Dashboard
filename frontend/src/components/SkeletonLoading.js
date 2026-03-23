import React from 'react';

const SkeletonElement = ({ width, height, className = '', style = {} }) => (
  <div
    className={`skeleton ${className}`}
    style={{
      width,
      height,
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'skeleton-loading 1.5s infinite',
      borderRadius: '4px',
      ...style,
    }}
  />
);

const SkeletonKPI = () => (
  <div className="kpi-widget" style={{ padding: '20px' }}>
    <SkeletonElement width="120px" height="24px" style={{ marginBottom: '16px' }} />
    <SkeletonElement width="200px" height="48px" style={{ marginBottom: '8px' }} />
    <SkeletonElement width="100px" height="16px" />
  </div>
);

const SkeletonChart = () => (
  <div className="chart-widget" style={{ padding: '20px', height: '250px' }}>
    <SkeletonElement width="150px" height="24px" style={{ marginBottom: '16px' }} />
    <SkeletonElement width="100%" height="200px" />
  </div>
);

const SkeletonTable = () => (
  <div className="table-widget" style={{ padding: '20px' }}>
    <SkeletonElement width="150px" height="24px" style={{ marginBottom: '16px' }} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {[...Array(5)].map((_, index) => (
        <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <SkeletonElement width="80px" height="16px" />
          <SkeletonElement width="120px" height="16px" />
          <SkeletonElement width="100px" height="16px" />
          <SkeletonElement width="80px" height="16px" />
          <SkeletonElement width="100px" height="16px" />
        </div>
      ))}
    </div>
  </div>
);

const SkeletonWidget = ({ type }) => {
  switch (type) {
    case 'kpi':
      return <SkeletonKPI />;
    case 'bar':
    case 'line':
    case 'pie':
      return <SkeletonChart />;
    case 'table':
      return <SkeletonTable />;
    default:
      return <SkeletonChart />;
  }
};

export const SkeletonDashboard = () => (
  <div className="dashboard-container">
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', padding: '20px' }}>
      <SkeletonWidget type="kpi" />
      <SkeletonWidget type="kpi" />
      <SkeletonWidget type="kpi" />
      <SkeletonWidget type="kpi" />
      <SkeletonWidget type="bar" />
      <SkeletonWidget type="line" />
      <SkeletonWidget type="pie" />
      <SkeletonWidget type="table" />
    </div>
  </div>
);

export default SkeletonWidget;
