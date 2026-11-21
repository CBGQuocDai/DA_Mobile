import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppIcon } from '@/presentation/components/common/AppIcon';
import { CustomerTheme as C } from '@/shared/constants/customerTheme.constants';
import { DetailSection } from './DetailSection';

export function BookIntroduction({ description, tags }: { description: string; tags: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const canExpand = description.length > 240;
  return (
    <DetailSection title="Giới thiệu cuốn sách">
      <Text numberOfLines={!expanded && canExpand ? 5 : undefined} style={styles.description}>{description}</Text>
      {canExpand && <Pressable onPress={() => setExpanded((value) => !value)} accessibilityRole="button" accessibilityState={{ expanded }} style={styles.expand}>
        <Text style={styles.expandText}>{expanded ? 'Thu gọn giới thiệu' : 'Đọc thêm'}</Text><AppIcon name={expanded ? 'chevronUp' : 'chevronDown'} color={C.accent} size={14} />
      </Pressable>}
      <View style={styles.tags}>{tags.map((tag) => <Text key={tag} style={styles.tag}># {tag}</Text>)}</View>
    </DetailSection>
  );
}
const styles = StyleSheet.create({
  description: { color: C.secondary, fontSize: 13, lineHeight: 24 },
  expand: { flexDirection: 'row', gap: 5, alignItems: 'center', alignSelf: 'flex-start', minHeight: 42, marginTop: 3 },
  expandText: { color: C.accent, fontSize: 11, fontWeight: '700' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 15 },
  tag: { backgroundColor: C.surface, borderRadius: 8, overflow: 'hidden', color: C.secondary, fontSize: 10, paddingHorizontal: 11, paddingVertical: 8 },
});
