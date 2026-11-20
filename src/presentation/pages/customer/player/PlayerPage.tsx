import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/presentation/components/common/ThemedText';
import { ThemedView } from '@/presentation/components/common/ThemedView';

export function PlayerPage() {
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Trình phát</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        player/[chapterId] · chapterId = {chapterId}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
});
