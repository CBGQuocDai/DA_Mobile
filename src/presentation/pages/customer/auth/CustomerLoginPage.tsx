import { StyleSheet } from 'react-native';

import { ThemedText } from '@/presentation/components/common/ThemedText';
import { ThemedView } from '@/presentation/components/common/ThemedView';

export function CustomerLoginPage() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Đăng nhập</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        (auth)/login
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
});
