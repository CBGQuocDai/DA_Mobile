import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const scheme = useColorScheme();

  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="book/[id]" options={{ headerShown: true, title: 'Chi tiết sách' }} />
        <Stack.Screen name="player/[chapterId]" options={{ headerShown: true, title: 'Trình phát' }} />
        <Stack.Screen name="payment/callback" options={{ headerShown: true, title: 'Thanh toán' }} />
      </Stack>
    </ThemeProvider>
  );
}
