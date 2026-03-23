import React, { memo } from 'react';
import { useOrderDataContext } from '../../contexts/OrderDataContext';
import { getInsightForWidget } from '../../utils/insightGenerator';
import Insights from '../common/Insights';

// Simple loading skeleton for table
const TableSkeleton = () => (
  <div>
    <h3>Loading...</h3>
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(5, 1fr)', 
        gap: '10px',
        marginBottom: '10px'
      }}>
        {['Order #', 'Customer', 'Amount', 'Status', 'Date'].map((header, i) => (
          <div key={i} style={{ 
            height: '20px', 
            backgroundColor: '#f0f0f0', 
            borderRadius: '4px' 
          }} />
        ))}
      </div>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr)', 
          gap: '10px',
          marginBottom: '8px'
        }}>
          {[1, 2, 3, 4, 5].map(j => (
            <div key={j} style={{ 
              height: '16px', 
              backgroundColor: '#f8f8f8', 
              borderRadius: '4px' 
            }} />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Memoized KPI Widget
const MemoizedKPIWidget = memo(({ widget }) => {
  const { aggregations, loading, error } = useOrderDataContext();

  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0);

  const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num || 0);

  const kpiData = React.useMemo(() => {
    const config = widget.config || {};
    const metric = config.metric || 'total_revenue';
    
    switch (metric) {
      case 'total_revenue':
        return {
          value: formatCurrency(aggregations.totalRevenue || 0),
          label: 'Total Revenue',
        };
      case 'total_orders':
        return {
          value: formatNumber(aggregations.totalOrders || 0),
          label: 'Total Orders',
        };
      case 'avg_order_value':
        return {
          value: formatCurrency(aggregations.avgOrderValue || 0),
          label: 'Avg Order Value',
        };
      default:
        return {
          value: '0',
          label: 'Metric',
        };
    }
  }, [widget.config, aggregations]);

  const insights = React.useMemo(() => {
    if (!aggregations.totalRevenue && !aggregations.totalOrders) return [];
    return getInsightForWidget([], 'kpi');
  }, [aggregations]);

  if (loading) {
    return (
      <div className="kpi-widget">
        <h3>{widget.title}</h3>
        <div className="kpi-value">Loading...</div>
        <div className="kpi-title">Please wait</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="kpi-widget">
        <h3>{widget.title}</h3>
        <div className="kpi-value">Error</div>
        <div className="kpi-title">Failed to load data</div>
      </div>
    );
  }

  return (
    <div className="kpi-widget">
      <h3>{widget.title}</h3>
      <div className="kpi-value">{kpiData.value}</div>
      <div className="kpi-title">{kpiData.label}</div>
      <Insights insights={insights} maxItems={2} />
    </div>
  );
});

MemoizedKPIWidget.displayName = 'MemoizedKPIWidget';

// Memoized Table Widget
const MemoizedTableWidget = memo(({ widget }) => {
  const { aggregations, loading, error } = useOrderDataContext();
  const [currentPage, setCurrentPage] = React.useState(1);
  const config = widget.config || {};
  const pageSize = config.pageSize || 10;

  // Add safety checks for data
  const tableData = React.useMemo(() => {
    if (!aggregations || !Array.isArray(aggregations.recentOrders)) {
      console.warn('Table widget: recentOrders is not an array', aggregations);
      return [];
    }
    return aggregations.recentOrders;
  }, [aggregations]);
  
  const paginatedData = React.useMemo(() => {
    if (!tableData.length) return [];
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return tableData.slice(startIndex, endIndex);
  }, [tableData, currentPage, pageSize]);

  const totalPages = Math.ceil(tableData.length / pageSize);

  const handlePageChange = React.useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const getColumns = React.useMemo(() => {
    const defaultColumns = [
      { key: 'order_number', label: 'Order #' },
      { key: 'customer_name', label: 'Customer' },
      { key: 'amount', label: 'Amount' },
      { key: 'status', label: 'Status' },
      { key: 'order_date', label: 'Date' },
    ];
    return config.columns || defaultColumns;
  }, [config.columns]);

  const getStatusColor = React.useCallback((status) => {
    const colors = {
      pending: '#ffc107',
      confirmed: '#007bff',
      shipped: '#17a2b8',
      delivered: '#28a745',
      cancelled: '#dc3545',
    };
    return colors[status] || '#6c757d';
  }, []);

  const renderCellValue = React.useCallback((key, value) => {
    switch (key) {
      case 'amount':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(parseFloat(value || 0));
      case 'order_date':
        return new Date(value).toLocaleDateString();
      case 'status':
        return (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              backgroundColor: getStatusColor(value),
              color: 'white',
            }}
          >
            {value}
          </span>
        );
      default:
        return value || '-';
    }
  }, [getStatusColor]);

  if (loading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <div>
        <h3>{widget.title}</h3>
        <div className="table-placeholder" style={{ color: '#dc3545' }}>
          Error loading table data: {error}
        </div>
      </div>
    );
  }

  if (!tableData.length) {
    return (
      <div>
        <h3>{widget.title}</h3>
        <div className="table-placeholder">No data available</div>
      </div>
    );
  }

  return (
    <div>
      <h3>{widget.title}</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
              {getColumns().map((column) => (
                <th
                  key={column.key}
                  style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#495057',
                    borderBottom: '1px solid #dee2e6',
                  }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={row.id || index}
                style={{
                  backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa',
                  borderBottom: '1px solid #dee2e6',
                }}
              >
                {getColumns().map((column) => (
                  <td
                    key={column.key}
                    style={{
                      padding: '8px 12px',
                      color: '#495057',
                    }}
                  >
                    {renderCellValue(column.key, row[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '12px',
          }}
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '4px 8px',
              border: '1px solid #dee2e6',
              backgroundColor: currentPage === 1 ? '#f8f9fa' : 'white',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            Previous
          </button>
          
          <span style={{ fontSize: '14px', color: '#495057' }}>
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: '4px 8px',
              border: '1px solid #dee2e6',
              backgroundColor: currentPage === totalPages ? '#f8f9fa' : 'white',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
});

MemoizedTableWidget.displayName = 'MemoizedTableWidget';

export { MemoizedKPIWidget, MemoizedTableWidget };
