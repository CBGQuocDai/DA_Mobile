import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import { playerStore } from '@/presentation/stores/player.store';

/** Audio owns its clock; this timer only saves checkpoints and checks the sleep timer. */
export function PlayerRuntime() {
  useEffect(() => {
    const timer = setInterval(playerStore.maintenance, 10000);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') void playerStore.flush();
      else playerStore.maintenance();
    });
    const flush = () => { void playerStore.flush(); };
    const online = () => { void playerStore.retry(); };
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener?.('pagehide', flush);
      window.addEventListener?.('online', online);
    }
    return () => {
      clearInterval(timer);
      subscription.remove();
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.removeEventListener?.('pagehide', flush);
        window.removeEventListener?.('online', online);
      }
      flush();
    };
  }, []);
  return null;
}
