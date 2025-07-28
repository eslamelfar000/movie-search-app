import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-cinema-gold border-t-transparent cinema-glow`} />
    </div>
  );
};

export const LoadingGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="cinema-card rounded-lg overflow-hidden">
          <div className="aspect-[2/3] bg-muted animate-pulse" />
          <div className="p-4 space-y-2">
            <div className="h-6 bg-muted rounded animate-pulse" />
            <div className="flex justify-between">
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};