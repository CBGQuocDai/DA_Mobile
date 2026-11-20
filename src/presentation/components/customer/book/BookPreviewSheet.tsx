import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/presentation/components/common/AppIcon';
import { CustomerTheme as C } from '@/shared/constants/customerTheme.constants';
import { BookCover } from './BookCover';
import type { BookPreview } from './book.types';

interface BookPreviewSheetProps {
  book: BookPreview;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
}

export function BookPreviewSheet({ book, isFavorite, onToggleFavorite, onClose }: BookPreviewSheetProps) {
  return (
    <Modal transparent animationType="slide" visible onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Đóng giới thiệu sách" accessibilityRole="button" />
        <SafeAreaView edges={['bottom']} style={styles.sheet} accessibilityViewIsModal>
          <View style={styles.handle} />
          <View style={styles.toolbar}>
            <Text style={styles.toolbarTitle}>Một cuốn sách dành cho bạn</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Đóng" onPress={onClose} style={styles.close}>
              <AppIcon name="close" size={18} color={C.secondary} />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <View style={styles.cover}><BookCover book={book} width={127} /></View>
            <Text style={styles.category}>{book.categoryLabel.toUpperCase()}</Text>
            <Text accessibilityRole="header" style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>{book.author}</Text>
            <View style={styles.metadata}>
              <AppIcon name="star" color={C.gold} size={16} />
              <Text style={styles.rating}>{book.rating === null ? 'Chưa có đánh giá' : book.rating.toFixed(1)}</Text>
              {book.duration && (
                <>
                  <View style={styles.divider} />
                  <AppIcon name="clock" color={C.secondary} size={15} />
                  <Text style={styles.duration}>{book.duration}</Text>
                </>
              )}
            </View>
            <View style={styles.about}>
              <Text style={styles.aboutTitle}>Về cuốn sách</Text>
              <Text style={styles.description}>{book.description}</Text>
            </View>
          </ScrollView>
          <View style={styles.actions}>
            <Pressable accessibilityRole="button" accessibilityState={{ selected: isFavorite }}
              onPress={onToggleFavorite} style={({ pressed }) => [styles.favorite, isFavorite && styles.saved, pressed && styles.pressed]}>
              <AppIcon name={isFavorite ? 'heartFilled' : 'heart'} color={isFavorite ? C.accent : '#FFFFFF'} size={19} />
              <Text style={[styles.favoriteText, isFavorite && styles.savedText]}>{isFavorite ? 'Đã thêm vào yêu thích' : 'Thêm vào yêu thích'}</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: '#17203366' },
  sheet: { width: '100%', maxWidth: 560, maxHeight: '92%', borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: C.background, overflow: 'hidden' },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#E3E5EA', alignSelf: 'center', marginTop: 11 },
  toolbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 10, paddingBottom: 4 },
  toolbarTitle: { color: C.secondary, fontSize: 11, fontWeight: '500' },
  close: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 10, alignItems: 'center' },
  cover: { marginBottom: 23 },
  category: { color: C.accent, fontSize: 9, fontWeight: '700', letterSpacing: 1.5 },
  title: { color: C.text, fontSize: 23, lineHeight: 30, fontWeight: '800', textAlign: 'center', marginTop: 9, letterSpacing: -0.6 },
  author: { color: C.secondary, fontSize: 12, lineHeight: 20, textAlign: 'center', marginTop: 6 },
  metadata: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 17, marginBottom: 22 },
  rating: { color: C.gold, fontSize: 12, fontWeight: '700' },
  duration: { color: C.secondary, fontSize: 11 },
  divider: { width: 1, height: 13, backgroundColor: C.border, marginHorizontal: 8 },
  about: { alignSelf: 'stretch', paddingTop: 19, borderTopWidth: 1, borderTopColor: C.border },
  aboutTitle: { color: C.text, fontSize: 15, fontWeight: '700', marginBottom: 9 },
  description: { color: C.secondary, fontSize: 13, lineHeight: 23 },
  actions: { paddingHorizontal: 24, paddingTop: 13, paddingBottom: 18 },
  favorite: { minHeight: 50, borderRadius: 15, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 9 },
  saved: { backgroundColor: C.accentLight },
  favoriteText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  savedText: { color: C.accent },
  pressed: { opacity: 0.7 },
});
