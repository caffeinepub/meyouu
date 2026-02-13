import { useAuth } from '../../hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { LogIn, LogOut } from 'lucide-react';

export default function LoginButton() {
  const { isAuthenticated, login, logout, isLoggingIn } = useAuth();
  const queryClient = useQueryClient();

  const handleAuth = async () => {
    if (isAuthenticated) {
      await logout();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await logout();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <Button
      onClick={handleAuth}
      disabled={isLoggingIn}
      variant={isAuthenticated ? 'outline' : 'default'}
      className="gap-2"
    >
      {isLoggingIn ? (
        'Logging in...'
      ) : isAuthenticated ? (
        <>
          <LogOut className="h-4 w-4" />
          Logout
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4" />
          Login
        </>
      )}
    </Button>
  );
}
