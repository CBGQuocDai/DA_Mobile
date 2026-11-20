import { Stack } from 'expo-router';

import { AppProviders } from '@/presentation/providers/AppProviders';

export function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="book/[id]" options={{ headerShown: true, title: 'Chi tiết sách' }} />
        <Stack.Screen name="player/[chapterId]" options={{ headerShown: true, title: 'Trình phát' }} />
        <Stack.Screen name="payment/callback" options={{ headerShown: true, title: 'Thanh toán' }} />
      </Stack>
    </AppProviders>
  );
}
