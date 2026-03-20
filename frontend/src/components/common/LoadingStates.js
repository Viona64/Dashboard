import React from 'react';

const LoadingSpinner = ({ size = 'small' }) => {
  const sizeStyles = {
    small: { width: '20px', height: '20px' },
    medium: { width: '40px', height: '40px' },
    large: { width: '60px', height: '60px' },
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          border: '2px solid #f3f3f3',
          borderTop: '2px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          ...sizeStyles[size],
        }}
      />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export const ErrorBoundary = ({ children, error }) => {
  if (error) {
    return (
      <div
        style={{
          padding: '20px',
          textAlign: 'center',
          color: '#dc3545',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
        }}
      >
        <h4>Error</h4>
        <p>{error}</p>
      </div>
    );
  }

  return children;
};

export const DataLoadingState = ({ message = 'Loading data...' }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      color: '#6c757d',
    }}
  >
    <LoadingSpinner size="medium" />
    <p style={{ marginTop: '10px' }}>{message}</p>
  </div>
);

export const DataErrorState = ({ error, onRetry }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      color: '#dc3545',
    }}
  >
    <div
      style={{
        fontSize: '48px',
        marginBottom: '10px',
      }}
    >
      ⚠️
    </div>
    <h4>Failed to load data</h4>
    <p>{error}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        style={{
          marginTop: '10px',
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Retry
      </button>
    )}
  </div>
);

export const EmptyState = ({ message = 'No data available' }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      color: '#6c757d',
    }}
  >
    <div
      style={{
        fontSize: '48px',
        marginBottom: '10px',
      }}
    >
      📊
    </div>
    <p>{message}</p>
  </div>
);

export default LoadingSpinner;
