import { useInternetIdentity } from './useInternetIdentity';

export function useAuth() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const principalString = identity?.getPrincipal().toString() || null;

  return {
    isAuthenticated,
    principalString,
    identity,
    login,
    logout: clear,
    loginStatus,
    isLoggingIn: loginStatus === 'logging-in',
  };
}
