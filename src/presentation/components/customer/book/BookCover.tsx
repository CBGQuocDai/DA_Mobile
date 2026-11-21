import { Image } from 'expo-image';
import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/presentation/components/common/AppIcon';
import type { BookPreview } from './book.types';

export function BookCover({ book, width }: { book: Pick<BookPreview, 'id' | 'title' | 'coverTitle' | 'author' | 'cover'>; width: number }) {
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const uri = book.cover.uri;
  const hasRemoteCover = Boolean(uri && uri !== failedUri);

  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" aria-hidden
      style={[styles.cover, { width, height: width * 1.5, backgroundColor: book.cover.background }]}>
      {hasRemoteCover ? (
        <Image source={{ uri }} alt="" recyclingKey={book.id} style={StyleSheet.absoluteFill} contentFit="cover"
          accessibilityIgnoresInvertColors onError={() => setFailedUri(uri ?? null)} />
      ) : (
        <>
          {book.cover.source && <Image source={book.cover.source} alt="" style={StyleSheet.absoluteFill} contentFit="cover" accessibilityIgnoresInvertColors />}
          <View style={styles.spine} />
          <Text numberOfLines={1} style={[styles.author, { color: book.cover.ink, fontSize: width * 0.054 }]}>
            {book.author}
          </Text>
          <Text style={[styles.title, {
            color: book.cover.ink, fontSize: width * (book.coverTitle.length > 30 ? 0.13 : 0.155), lineHeight: width * 0.19,
            top: width * 0.26, left: width * 0.1, right: width * 0.08,
          }]}>
            {book.coverTitle}
          </Text>
          <View style={styles.imprint}>
            <AppIcon name="headphones" size={width * 0.075} color={book.cover.ink} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cover: { borderRadius: 7, overflow: 'hidden', boxShadow: '0px 7px 15px rgba(30, 35, 48, 0.13)' },
  spine: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, backgroundColor: '#0000000B', borderRightWidth: 1, borderRightColor: '#FFFFFF35', zIndex: 1 },
  author: { position: 'absolute', top: '8%', left: '10%', right: '8%', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.9, fontWeight: '600' },
  title: { position: 'absolute', textAlign: 'center', fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' }), fontWeight: '700' },
  imprint: { position: 'absolute', bottom: '5%', right: '8%', opacity: 0.65 },
});
