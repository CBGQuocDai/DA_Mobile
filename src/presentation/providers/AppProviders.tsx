import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import type { PropsWithChildren } from 'react';

import { useColorScheme } from '@/presentation/hooks/common/useColorScheme';

export function AppProviders({ children }: PropsWithChildren) {
  const scheme = useColorScheme();

  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      {children}
    </ThemeProvider>
  );
}
