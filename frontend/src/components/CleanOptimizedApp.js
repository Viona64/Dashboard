import React, { Suspense, lazy } from 'react';
import { DataLoadingState } from './common/LoadingStates';

// Only load the optimized dashboard - no legacy imports
const OptimizedDashboard = lazy(() => import('./OptimizedDashboard'));

const LoadingFallback = () => <DataLoadingState message="Loading dashboard..." />;

const CleanOptimizedApp = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OptimizedDashboard />
    </Suspense>
  );
};

export default CleanOptimizedApp;
