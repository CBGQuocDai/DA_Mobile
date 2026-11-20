import { StyleSheet } from 'react-native';

import { ThemedText } from '@/presentation/components/common/ThemedText';
import { ThemedView } from '@/presentation/components/common/ThemedView';

export function SearchPage() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Tìm kiếm</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        (tabs)/search
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
});
