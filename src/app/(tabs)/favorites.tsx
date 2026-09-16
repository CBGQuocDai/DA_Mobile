import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function FavoritesScreen() {
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
