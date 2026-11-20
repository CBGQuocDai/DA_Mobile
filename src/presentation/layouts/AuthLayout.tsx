import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useCustomerAuth } from '@/presentation/hooks/customer/useCustomerAuth';
import { CustomerTheme as C } from '@/shared/constants/customerTheme.constants';

export function AuthLayout() {
  const { isReady, isAuthenticated } = useCustomerAuth();
  if (!isReady) return <View style={styles.loading}><ActivityIndicator color={C.accent} /><Text style={styles.loadingText}>Đang kiểm tra phiên đăng nhập...</Text></View>;
  if (isAuthenticated) return <Redirect href="/(tabs)" />;
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFFFF' } }}>
      <Stack.Screen name="login" options={{ title: 'Đăng nhập' }} />
      <Stack.Screen name="register" options={{ title: 'Đăng ký' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.background, gap: 12 },
  loadingText: { fontSize: 12, color: C.secondary },
});
