import React from 'react';

const Insights = ({ insights, maxItems = 3 }) => {
  const getInsightIcon = (type) => {
    switch (type) {
      case 'revenue':
        return '💰';
      case 'orders':
        return '📦';
      case 'trend':
        return '📈';
      case 'product':
        return '🏆';
      case 'anomaly':
        return '⚠️';
      default:
        return '💡';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'positive':
        return '📈';
      case 'negative':
        return '📉';
      default:
        return '➡️';
    }
  };

  // const getPriorityColor = (priority) => {
  //   switch (priority) {
  //     case 'high':
  //       return '#dc3545';
  //     case 'medium':
  //       return '#ffc107';
  //     case 'low':
  //       return '#28a745';
  //     default:
  //       return '#6c757d';
  //   }
  // };

  const getPriorityBorder = (priority) => {
    switch (priority) {
      case 'high':
        return '2px solid #dc3545';
      case 'medium':
        return '2px solid #ffc107';
      case 'low':
        return '2px solid #28a745';
      default:
        return '2px solid #dee2e6';
    }
  };

  if (!insights || insights.length === 0) {
    return (
      <div style={{ marginTop: '10px' }}>
        <div style={{
          padding: '8px 12px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#6c757d',
          textAlign: 'center',
        }}>
          No insights available
        </div>
      </div>
    );
  }

  const displayInsights = insights.slice(0, maxItems);

  return (
    <div style={{ marginTop: '10px' }}>
      <div style={{
        fontSize: '12px',
        fontWeight: '600',
        color: '#495057',
        marginBottom: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}>
        <span>💡</span>
        <span>Smart Insights</span>
      </div>
      
      {displayInsights.map((insight, index) => (
        <div
          key={index}
          style={{
            padding: '8px 12px',
            backgroundColor: '#f8f9fa',
            border: getPriorityBorder(insight.priority),
            borderRadius: '4px',
            fontSize: '12px',
            color: '#495057',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '6px',
            lineHeight: '1.4',
          }}
        >
          <span style={{ fontSize: '14px', flexShrink: 0 }}>
            {getInsightIcon(insight.type)}
          </span>
          <span style={{ flex: 1 }}>
            {insight.text}
          </span>
          <span style={{ fontSize: '12px', flexShrink: 0 }}>
            {getTrendIcon(insight.trend)}
          </span>
        </div>
      ))}
      
      {insights.length > maxItems && (
        <div style={{
          fontSize: '11px',
          color: '#6c757d',
          textAlign: 'center',
          marginTop: '4px',
        }}>
          +{insights.length - maxItems} more insights
        </div>
      )}
    </div>
  );
};

export default Insights;
