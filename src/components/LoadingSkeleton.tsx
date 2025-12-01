import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'text' | 'image' | 'button';
  count?: number;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  type = 'card', 
  count = 1,
  className = '' 
}) => {
  const skeletons = Array.from({ length: count }, (_, index) => index);

  const renderSkeleton = (key: number) => {
    switch (type) {
      case 'card':
        return (
          <div
            key={key}
            className={`bg-gray-200 rounded-2xl p-6 shimmer ${className}`}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full shimmer"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded shimmer w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded shimmer w-1/2"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 rounded shimmer"></div>
              <div className="h-3 bg-gray-300 rounded shimmer w-5/6"></div>
              <div className="h-3 bg-gray-300 rounded shimmer w-4/6"></div>
            </div>
          </div>
        );

      case 'text':
        return (
          <div key={key} className={`space-y-2 ${className}`}>
            <div className="h-4 bg-gray-200 rounded shimmer w-full"></div>
            <div className="h-4 bg-gray-200 rounded shimmer w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded shimmer w-4/6"></div>
          </div>
        );

      case 'image':
        return (
          <div
            key={key}
            className={`bg-gray-200 rounded-2xl shimmer ${className}`}
            style={{ aspectRatio: '16/9' }}
          ></div>
        );

      case 'button':
        return (
          <div
            key={key}
            className={`h-12 bg-gray-200 rounded-2xl shimmer ${className}`}
          ></div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="animate-pulse">
      {skeletons.map(renderSkeleton)}
    </div>
  );
};

export default LoadingSkeleton; 
