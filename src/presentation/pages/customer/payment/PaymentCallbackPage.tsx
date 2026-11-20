import { StyleSheet } from 'react-native';

import { ThemedText } from '@/presentation/components/common/ThemedText';
import { ThemedView } from '@/presentation/components/common/ThemedView';

export function PaymentCallbackPage() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Kết quả thanh toán</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        payment/callback
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
});
