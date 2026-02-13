import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle, Inbox } from 'lucide-react';

interface QueryStateProps {
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  children: React.ReactNode;
}

export default function QueryState({
  isLoading,
  isError,
  error,
  isEmpty,
  emptyMessage = 'No items found',
  emptyIcon,
  loadingComponent,
  children,
}: QueryStateProps) {
  if (isLoading) {
    return loadingComponent || <LoadingSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error?.message || 'An error occurred while loading data.'}
        </AlertDescription>
      </Alert>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          {emptyIcon || <Inbox className="h-8 w-8 text-muted-foreground" />}
        </div>
        <p className="text-lg font-medium text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
