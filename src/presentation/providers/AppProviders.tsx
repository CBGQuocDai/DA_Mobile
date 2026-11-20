import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState, type PropsWithChildren } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useColorScheme } from '@/presentation/hooks/common/useColorScheme';
import { createQueryClient } from '@/infrastructure/query/queryClient';
import { authStore } from '@/presentation/stores/auth.store';

export function AppProviders({ children }: PropsWithChildren) {
  const scheme = useColorScheme();
  const [queryClient] = useState(createQueryClient);
  useEffect(() => { void authStore.initialize(); }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
