import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function PaymentCallbackScreen() {
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
