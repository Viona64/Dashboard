import React, { createContext, useContext, useMemo } from 'react';
import { useOptimizedOrderData } from '../hooks/useOptimizedOrderData';

const OrderDataContext = createContext();

export const OrderDataProvider = ({ children, filters = {} }) => {
  const orderData = useOptimizedOrderData(filters);
  
  const contextValue = useMemo(() => orderData, [orderData]);
  
  return (
    <OrderDataContext.Provider value={contextValue}>
      {children}
    </OrderDataContext.Provider>
  );
};

export const useOrderDataContext = () => {
  const context = useContext(OrderDataContext);
  if (!context) {
    throw new Error('useOrderDataContext must be used within OrderDataProvider');
  }
  return context;
};
