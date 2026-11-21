import { Stack } from 'expo-router';
import { View } from 'react-native';

import { AppProviders } from '@/presentation/providers/AppProviders';
import { GlobalMiniPlayer } from '@/presentation/components/customer/player/MiniPlayer';
import { CustomerTheme as C } from '@/shared/constants/customerTheme.constants';

export function RootLayout() {
  return (
    <AppProviders>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="book/[id]" options={{ title: 'Chi tiết sách' }} />
          <Stack.Screen name="player/[chapterId]" options={{ title: 'Trình phát', contentStyle: { backgroundColor: C.background } }} />
          <Stack.Screen name="payment/callback" options={{ headerShown: true, title: 'Thanh toán' }} />
        </Stack>
      </View>
      <GlobalMiniPlayer />
    </AppProviders>
  );
}
