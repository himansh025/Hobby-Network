import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Loading Cybernauts Network</h2>
        <p className="text-gray-600">Please wait while we load your data...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;