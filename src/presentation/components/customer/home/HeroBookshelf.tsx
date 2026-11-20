import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/presentation/components/common/AppIcon';
import type { BookPreview } from '@/presentation/components/customer/book/book.types';
import { CustomerTheme as C } from '@/shared/constants/customerTheme.constants';
import { BookshelfCarousel } from './BookshelfCarousel';

interface HeroBookshelfProps {
  books: BookPreview[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onSelectBook: (book: BookPreview) => void;
}

export function HeroBookshelf({ books, isLoading, error, onRetry, onSelectBook }: HeroBookshelfProps) {
  const [width, setWidth] = useState(330);
  const bodyHeight = Math.min(136, width * 0.4) * 1.5 + 118;

  return (
    <View style={styles.hero} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      <Image source={require('@/assets/images/home-glow.svg')} alt="" style={StyleSheet.absoluteFill} contentFit="fill" />
      <View style={styles.heading}>
        <View style={styles.eyebrow}>
          <View style={styles.eyebrowDot} />
          <Text style={styles.eyebrowText}>THẾ GIỚI SÁCH NÓI</Text>
        </View>
        <Text accessibilityRole="header" style={styles.title}>Sách cho{'\n'}<Text style={styles.accent}>mọi người.</Text></Text>
        <Text style={styles.subtitle}>Mỗi cuốn sách, một hành trình mới.</Text>
      </View>
      <View style={{ minHeight: bodyHeight }}>
        {isLoading ? (
          <View style={[styles.status, { minHeight: bodyHeight }]} accessibilityLiveRegion="polite" accessibilityState={{ busy: true }}>
            <ActivityIndicator color={C.accent} />
            <Text style={styles.statusText}>Đang tải sách nổi bật...</Text>
          </View>
        ) : error ? (
          <View style={[styles.status, { minHeight: bodyHeight }]} accessibilityRole="alert">
            <AppIcon name="headphones" size={30} color={C.accent} />
            <Text style={styles.statusText}>{error}</Text>
            <Pressable onPress={onRetry} accessibilityRole="button" style={styles.retry}>
              <Text style={styles.retryText}>Thử lại</Text>
            </Pressable>
          </View>
        ) : books.length === 0 ? (
          <View style={[styles.status, { minHeight: bodyHeight }]} accessibilityLiveRegion="polite">
            <AppIcon name="headphones" size={30} color="#C5A8B0" />
            <Text style={styles.statusText}>Chưa có sách để hiển thị.</Text>
          </View>
        ) : (
          <BookshelfCarousel key={books.map(({ id }) => id).join(',')} books={books} width={width} onSelectBook={onSelectBook} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { marginHorizontal: 16, borderRadius: 26, paddingTop: 23, paddingBottom: 17, overflow: 'hidden', backgroundColor: '#FFF6F7' },
  heading: { alignItems: 'center', paddingHorizontal: 18 },
  eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 9 },
  eyebrowDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.accent },
  eyebrowText: { color: C.accentDark, fontSize: 8, fontWeight: '700', letterSpacing: 2 },
  title: { color: C.text, fontSize: 35, lineHeight: 39, fontWeight: '800', letterSpacing: -1.5, textAlign: 'center' },
  accent: { color: C.accent },
  subtitle: { color: '#967B82', fontSize: 10, lineHeight: 18, marginTop: 8 },
  status: { alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 30 },
  statusText: { color: C.secondary, fontSize: 12, lineHeight: 20, textAlign: 'center' },
  retry: { paddingHorizontal: 22, paddingVertical: 12, backgroundColor: C.background, borderWidth: 1, borderColor: '#F4D4DC', borderRadius: 22 },
  retryText: { color: C.accent, fontSize: 12, fontWeight: '600' },
});
