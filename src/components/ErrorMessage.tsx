import React from 'react';
import { AlertTriangle, RefreshCw, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
  isThrottled?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  error, 
  onRetry, 
  isThrottled = false 
}) => {
  const getIcon = () => {
    if (isThrottled) return <AlertTriangle className="h-4 w-4" />;
    if (error.includes('connect') || error.includes('network')) {
      return <Wifi className="h-6 w-6" />;
    }
    return <AlertTriangle className="h-7 w-7" />;
  };

  const getVariant = () => {
    return isThrottled ? 'default' : 'destructive';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Alert
        variant={getVariant()}
        className="cinema-card border-cinema-red/30"
      >
        <AlertDescription className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>{getIcon()}</span>
            <span>{error}</span>
          </div>
          {onRetry && !isThrottled && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className=""
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </AlertDescription>
      </Alert>

      {isThrottled && (
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            API rate limit reached. Please wait a moment before searching again.
          </p>
        </div>
      )}
    </div>
  );
};