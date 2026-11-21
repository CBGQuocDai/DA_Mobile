import { useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/presentation/components/common/AppIcon';
import { BookCover } from '@/presentation/components/customer/book/BookCover';
import { usePlayer } from '@/presentation/hooks/customer/usePlayer';
import { playerRoute } from '@/presentation/utils/player.utils';
import { CustomerTheme as C } from '@/shared/constants/customerTheme.constants';

export function MiniPlayer({ bottomInset = true }: { bottomInset?: boolean }) {
  const player = usePlayer();
  const router = useRouter();
  if (!player.book || !player.chapter) return null;
  const { book, chapter } = player;
  return (
    <SafeAreaView edges={bottomInset ? ['bottom'] : []} style={styles.dock}>
      <View style={styles.card}>
        <View pointerEvents="none" style={styles.tint} />
        <Pressable onPress={() => router.push(playerRoute(book, chapter.id))} accessibilityRole="button"
          accessibilityLabel={`Mở trình phát ${book.title}, chương ${player.chapterIndex + 1}`} style={styles.main}>
          <BookCover book={book} width={33} />
          <View style={styles.metadata}>
            <Text numberOfLines={1} style={styles.title}>{book.title}</Text>
            <Text numberOfLines={1} style={styles.chapter}>{player.error || player.progressError || player.notice || `Chương ${player.chapterIndex + 1} · ${chapter.title}`}</Text>
          </View>
        </Pressable>
        <Pressable disabled={player.isLoading} onPress={player.toggle} accessibilityRole="button" accessibilityLabel={player.isPlaying ? 'Tạm dừng trình phát mini' : 'Tiếp tục từ trình phát mini'} style={styles.action}>
          {player.isLoading || player.isBuffering ? <ActivityIndicator color={C.accent} /> : <AppIcon name={player.isPlaying ? 'pause' : 'play'} size={26} color={C.accent} />}
        </Pressable>
        <Pressable onPress={player.close} accessibilityRole="button" accessibilityLabel="Đóng trình phát mini và dừng nghe" style={styles.close}>
          <AppIcon name="close" size={24} color={C.muted} />
        </Pressable>
        <View pointerEvents="none" style={styles.track}><View style={[styles.progress, { width: `${chapter.duration ? player.position / chapter.duration * 100 : 0}%` }]} /></View>
      </View>
    </SafeAreaView>
  );
}

/** Tabs render their own dock above the tab bar; full player never shows a mini copy. */
export function GlobalMiniPlayer() {
  const segments = useSegments();
  if (segments[0] === '(tabs)' || segments[0] === 'player') return null;
  return <MiniPlayer />;
}

const styles = StyleSheet.create({
  dock: { backgroundColor: C.background, paddingHorizontal: 12 },
  card: { width: '100%', maxWidth: 576, alignSelf: 'center', alignItems: 'center', flexDirection: 'row', minHeight: 69,
    marginTop: 6, marginBottom: 8, borderRadius: 15, backgroundColor: C.background, overflow: 'hidden',
    borderWidth: 1, borderColor: C.border, boxShadow: '0px 3px 12px rgba(23,32,51,0.08)' },
  tint: { position: 'absolute', top: -55, left: -50, width: 220, height: 180, borderRadius: 110, backgroundColor: C.accentLight },
  main: { flex: 1, minWidth: 0, flexDirection: 'row', gap: 10, alignItems: 'center', paddingLeft: 10, paddingVertical: 8 },
  metadata: { flex: 1, minWidth: 0 },
  title: { color: C.text, fontSize: 12, lineHeight: 20, fontWeight: '600' },
  chapter: { color: C.secondary, fontSize: 9, lineHeight: 16, marginTop: 2 },
  action: { width: 44, minHeight: 53, alignItems: 'center', justifyContent: 'center' },
  close: { width: 37, minHeight: 53, marginRight: 3, alignItems: 'center', justifyContent: 'center' },
  track: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, backgroundColor: C.accentLight },
  progress: { height: 2, backgroundColor: C.accent },
});
