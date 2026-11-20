import { StyleSheet } from 'react-native';

import { ThemedText } from '@/presentation/components/common/ThemedText';
import { ThemedView } from '@/presentation/components/common/ThemedView';

export function HomePage() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Trang chủ</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        (tabs)/index
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
});
