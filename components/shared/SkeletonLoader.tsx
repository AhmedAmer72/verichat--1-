
import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonLoaderProps {
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-secondary p-4',
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-secondary via-border to-secondary" />
    </div>
  );
};

export default SkeletonLoader;
