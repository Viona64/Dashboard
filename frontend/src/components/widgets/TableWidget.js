import React, { useState } from 'react';
import { useOrderData } from '../../hooks/useOrderData';
import { formatCurrency } from '../../utils/dataProcessing';

const TableWidget = ({ widget }) => {
  const { orders, loading, error } = useOrderData();
  const [currentPage, setCurrentPage] = useState(1);
  const config = widget.config || {};
  const pageSize = config.pageSize || 10;

  const paginatedData = orders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(orders.length / pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getColumns = () => {
    const defaultColumns = [
      { key: 'order_number', label: 'Order #' },
      { key: 'customer_name', label: 'Customer' },
      { key: 'amount', label: 'Amount' },
      { key: 'status', label: 'Status' },
      { key: 'order_date', label: 'Date' },
    ];
    
    return config.columns || defaultColumns;
  };

  const renderCellValue = (key, value) => {
    switch (key) {
      case 'amount':
        return formatCurrency(parseFloat(value || 0));
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
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      confirmed: '#007bff',
      shipped: '#17a2b8',
      delivered: '#28a745',
      cancelled: '#dc3545',
    };
    return colors[status] || '#6c757d';
  };

  if (loading) {
    return (
      <div>
        <h3>{widget.title}</h3>
        <div className="table-placeholder">
          Loading table data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h3>{widget.title}</h3>
        <div className="table-placeholder">
          Error loading table data
        </div>
      </div>
    );
  }

  const columns = getColumns();

  return (
    <div>
      <h3>{widget.title}</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
              {columns.map((column) => (
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
                {columns.map((column) => (
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
};

export default TableWidget;
