import { StyleSheet } from 'react-native';

import { ThemedText } from '@/presentation/components/common/ThemedText';
import { ThemedView } from '@/presentation/components/common/ThemedView';

export function ProfilePage() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Cá nhân</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        (tabs)/profile
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
});
