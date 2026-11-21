import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomerTheme as C } from '@/shared/constants/customerTheme.constants';
import type { BookDetailSection } from './bookDetail.types';

const SECTIONS: { id: BookDetailSection; label: string }[] = [
  { id: 'introduction', label: 'Giới thiệu' }, { id: 'chapters', label: 'Chương' },
  { id: 'reviews', label: 'Đánh giá' }, { id: 'related', label: 'Liên quan' },
];

export function BookDetailTabs({ selected, onSelect }: { selected: BookDetailSection; onSelect: (section: BookDetailSection) => void }) {
  return <View style={styles.tabs}>{SECTIONS.map((section) => (
    <Pressable key={section.id} accessibilityRole="button" accessibilityState={{ selected: selected === section.id }}
      onPress={() => onSelect(section.id)} style={[styles.tab, selected === section.id && styles.selected]}>
      <Text style={[styles.label, selected === section.id && styles.selectedLabel]}>{section.label}</Text>
    </Pressable>
  ))}</View>;
}
const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', backgroundColor: C.background, borderBottomWidth: 1, borderColor: C.border, paddingTop: 5 },
  tab: { flex: 1, minHeight: 47, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  selected: { borderBottomColor: C.accent },
  label: { color: C.secondary, fontSize: 11, fontWeight: '600' },
  selectedLabel: { color: C.accent, fontWeight: '800' },
});
