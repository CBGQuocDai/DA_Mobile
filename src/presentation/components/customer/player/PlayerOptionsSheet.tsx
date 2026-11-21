import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppIcon } from '@/presentation/components/common/AppIcon';
import type { usePlayer } from '@/presentation/hooks/customer/usePlayer';
import { formatAudioClock } from '@/presentation/utils/bookDetail.utils';
import { PLAYBACK_RATES } from '@/shared/types/player.types';
import { CustomerTheme as C } from '@/shared/constants/customerTheme.constants';

export type PlayerSheet = 'speed' | 'timer' | 'chapters' | null;

function Option({ label, selected, onPress, children }: { label: string; selected: boolean; onPress: () => void; children?: ReactNode }) {
  return <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected }} style={[styles.option, selected && styles.selected]}>
    <Text style={[styles.optionLabel, selected && styles.selectedText]}>{label}</Text>{children}
    {selected && <AppIcon name="check" size={17} color={C.accent} />}
  </Pressable>;
}

export function PlayerOptionsSheet({ sheet, onClose, player }: { sheet: PlayerSheet; onClose: () => void; player: ReturnType<typeof usePlayer> }) {
  return <Modal transparent visible={sheet !== null} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
    <View style={styles.overlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" accessibilityLabel="Đóng tùy chọn trình phát" />
      <SafeAreaView edges={['bottom']} style={styles.sheet} accessibilityViewIsModal>
        <View style={styles.handle} />
        <View style={styles.header}><Text accessibilityRole="header" style={styles.title}>{sheet === 'speed' ? 'Tốc độ phát' : sheet === 'timer' ? 'Hẹn giờ tắt' : 'Danh sách chương'}</Text>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Đóng danh sách tùy chọn" style={styles.close}><AppIcon name="close" size={21} color={C.secondary} /></Pressable>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.options}>
          {sheet === 'speed' && PLAYBACK_RATES.map((rate) => <Option key={rate} label={`${rate}x`} selected={player.rate === rate} onPress={() => { player.setRate(rate); onClose(); }} />)}
          {sheet === 'timer' && <>
            <Option label="Tắt hẹn giờ" selected={player.sleepEndsAt === null} onPress={() => { player.setSleepTimer(null); onClose(); }} />
            {[15, 30, 45, 60].map((minutes) => <Option key={minutes} label={`${minutes} phút`} selected={false} onPress={() => { player.setSleepTimer(minutes); onClose(); }} />)}
            {player.sleepEndsAt !== null && <Text style={styles.hint}>Còn khoảng {Math.max(1, Math.ceil((player.sleepEndsAt - Date.now()) / 60000))} phút trước khi dừng.</Text>}
          </>}
          {sheet === 'chapters' && player.chapters.map((chapter, index) => <Pressable key={chapter.id}
            accessibilityRole="button" accessibilityLabel={`Phát chương ${index + 1}: ${chapter.title}${chapter.canPlay ? '' : ', đang khóa'}`}
            onPress={() => { void player.selectChapter(chapter.id); if (chapter.canPlay) onClose(); }} style={[styles.chapter, player.chapter?.id === chapter.id && styles.selected]}>
            <Text style={styles.number}>{String(index + 1).padStart(2, '0')}</Text>
            <View style={styles.chapterBody}><Text style={styles.chapterTitle}>{chapter.title}</Text><Text style={styles.chapterDuration}>{formatAudioClock(chapter.duration)}{chapter.isFree ? ' · Nghe thử' : ''}</Text></View>
            <AppIcon name={!chapter.canPlay ? 'lock' : player.chapter?.id === chapter.id && player.isPlaying ? 'pause' : 'play'} size={18} color={chapter.canPlay ? C.accent : C.muted} />
          </Pressable>)}
          {player.notice && <Text accessibilityRole="alert" style={styles.hint}>{player.notice}</Text>}
        </ScrollView>
      </SafeAreaView>
    </View>
  </Modal>;
}
const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#1720334D', justifyContent: 'flex-end', alignItems: 'center' },
  sheet: { backgroundColor: C.background, borderTopLeftRadius: 23, borderTopRightRadius: 23, width: '100%', maxWidth: 520, maxHeight: '78%', overflow: 'hidden', borderWidth: 1, borderColor: C.border },
  handle: { alignSelf: 'center', width: 35, height: 4, borderRadius: 2, backgroundColor: C.border, marginTop: 10 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingTop: 9, paddingBottom: 9 },
  title: { color: C.text, fontSize: 17, fontWeight: '700' },
  close: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  options: { paddingHorizontal: 16, paddingBottom: 24, gap: 5 },
  option: { minHeight: 48, paddingHorizontal: 15, borderRadius: 11, flexDirection: 'row', alignItems: 'center', gap: 12 },
  optionLabel: { color: C.secondary, flex: 1, fontSize: 14 },
  selected: { backgroundColor: C.accentLight },
  selectedText: { color: C.accent, fontWeight: '600' },
  chapter: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 12, paddingVertical: 14, borderRadius: 11 },
  number: { color: C.muted, fontSize: 11, width: 20 },
  chapterBody: { flex: 1 },
  chapterTitle: { color: C.text, fontSize: 12, lineHeight: 19 },
  chapterDuration: { color: C.secondary, fontSize: 10, marginTop: 4 },
  hint: { color: C.accentDark, fontSize: 11, lineHeight: 20, paddingHorizontal: 12, paddingTop: 10 },
});
