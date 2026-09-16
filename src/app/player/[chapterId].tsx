import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function PlayerScreen() {
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
