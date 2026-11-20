import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/presentation/components/common/ThemedText';
import { ThemedView } from '@/presentation/components/common/ThemedView';

export function BookDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Chi tiết sách</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        book/[id] · id = {id}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
});
