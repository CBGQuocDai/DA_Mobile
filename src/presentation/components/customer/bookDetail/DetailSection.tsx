import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CustomerTheme as C } from '@/shared/constants/customerTheme.constants';

export function DetailSection({ title, count, subtitle, children }: { title: string; count?: number; subtitle?: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <Text accessibilityRole="header" style={styles.title}>{title}</Text>
        {count !== undefined && <Text style={styles.count}>{count}</Text>}
      </View>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingTop: 28, paddingBottom: 26, borderBottomWidth: 1, borderBottomColor: C.border },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 17 },
  title: { color: C.text, fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  count: { color: C.accent, backgroundColor: C.accentLight, borderRadius: 12, overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 4, fontSize: 11, fontWeight: '700' },
  subtitle: { color: C.secondary, fontSize: 12, lineHeight: 20, marginTop: -5, marginBottom: 18 },
});
