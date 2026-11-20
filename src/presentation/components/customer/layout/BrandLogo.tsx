import { StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/presentation/components/common/AppIcon';
import { CustomerTheme as C } from '@/shared/constants/customerTheme.constants';

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <View style={styles.brand}>
      <View style={[styles.icon, compact && styles.compactIcon]}>
        <AppIcon name="headphones" color={C.accent} size={compact ? 19 : 21} />
      </View>
      <Text style={[styles.wordmark, compact && styles.compactWordmark]}>
        audio<Text style={styles.book}>book</Text><Text style={[styles.dot, compact && styles.compactDot]}>.</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { width: 31, height: 34, alignItems: 'center', justifyContent: 'center' },
  compactIcon: { width: 24, height: 30 },
  wordmark: { fontSize: 25, letterSpacing: -1.1, fontWeight: '800', color: C.text },
  compactWordmark: { fontSize: 21, letterSpacing: -0.8 },
  book: { fontWeight: '600' },
  dot: { color: C.accent, fontSize: 29 },
  compactDot: { fontSize: 24 },
});
