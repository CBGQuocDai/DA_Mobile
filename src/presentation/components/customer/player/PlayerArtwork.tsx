import { StyleSheet, View } from 'react-native';
import { AppIcon } from '@/presentation/components/common/AppIcon';
import { BookCover } from '@/presentation/components/customer/book/BookCover';
import type { PlayerBook } from '@/shared/types/player.types';
import { CustomerTheme as C } from '@/shared/constants/customerTheme.constants';

export function PlayerArtwork({ book, width }: { book: PlayerBook; width: number }) {
  return <View style={[styles.artwork, { height: width * 1.5 + 55 }]}>
    <View pointerEvents="none" style={styles.glow} />
    <View style={styles.cover}><BookCover book={book} width={width} />
      <View style={styles.badge}><AppIcon name="headphones" size={18} color={C.accent} /></View>
    </View>
  </View>;
}
const styles = StyleSheet.create({
  artwork: { alignItems: 'center', justifyContent: 'center' },
  glow: { position: 'absolute', width: 210, height: 175, borderRadius: 105, backgroundColor: C.accentLight, boxShadow: `0px 0px 65px 35px ${C.accentLight}`, top: '25%' },
  cover: { borderRadius: 10, overflow: 'hidden', boxShadow: '0px 15px 30px rgba(23,32,51,0.14)' },
  badge: { position: 'absolute', right: 6, top: 6, width: 29, height: 29, borderRadius: 7, backgroundColor: C.background, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
});
