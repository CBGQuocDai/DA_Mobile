import { StyleSheet } from 'react-native';

import { ThemedText } from '@/presentation/components/common/ThemedText';
import { ThemedView } from '@/presentation/components/common/ThemedView';

export function FavoritesPage() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Yêu thích</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        (tabs)/favorites
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
});
