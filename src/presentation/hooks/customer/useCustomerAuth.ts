import { useSyncExternalStore } from 'react';
import { authStore } from '@/presentation/stores/auth.store';

export function useCustomerAuth() {
  const snapshot = useSyncExternalStore(authStore.subscribe, authStore.getSnapshot, authStore.getServerSnapshot);
  return {
    ...snapshot,
    isAuthenticated: snapshot.user !== null,
    login: authStore.login,
    register: authStore.register,
    logout: authStore.logout,
    restoreSession: authStore.restoreSession,
  };
}
