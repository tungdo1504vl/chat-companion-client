import { LoaderCircle } from 'lucide-react';
import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="flex flex-col h-32 items-center justify-center">
      <LoaderCircle className="h-6 w-6 animate-spin text-gray-500" />
    </div>
  );
};

export default LoadingSkeleton;
