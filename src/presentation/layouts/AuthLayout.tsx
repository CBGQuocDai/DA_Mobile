import { Stack } from 'expo-router';

export function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: 'Đăng nhập' }} />
      <Stack.Screen name="register" options={{ title: 'Đăng ký' }} />
    </Stack>
  );
}
