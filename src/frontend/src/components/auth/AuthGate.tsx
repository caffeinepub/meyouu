import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ShieldAlert } from 'lucide-react';

interface AuthGateProps {
  children: React.ReactNode;
  message?: string;
}

export default function AuthGate({ children, message }: AuthGateProps) {
  const { isAuthenticated, login, isLoggingIn } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
              <ShieldAlert className="h-6 w-6 text-amber-600 dark:text-amber-500" />
            </div>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              {message || 'You need to sign in to access this page.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={login} disabled={isLoggingIn} size="lg">
              {isLoggingIn ? 'Logging in...' : 'Sign In'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
