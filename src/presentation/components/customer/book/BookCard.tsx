import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/presentation/components/common/AppIcon';
import { CustomerTheme as C } from '@/shared/constants/customerTheme.constants';
import { BookCover } from './BookCover';
import type { BookPreview } from './book.types';

export function BookCard({ book, width, onPress }: { book: BookPreview; width: number; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${book.title}, ${book.author}`} onPress={onPress}
      style={({ pressed }) => [styles.card, { width, opacity: pressed ? 0.75 : 1 }]}>
      <View>
        <BookCover book={book} width={width} />
        <View style={styles.price}>
          <Text style={styles.priceText}>{book.price === null ? 'Chưa có giá' : book.price === 0 ? 'Miễn phí' : `${book.price.toLocaleString('vi-VN')}đ`}</Text>
        </View>
      </View>
      <Text numberOfLines={2} style={styles.title}>{book.title}</Text>
      <Text numberOfLines={1} style={styles.author}>{book.author}</Text>
      <View style={styles.metadata}>
        <AppIcon name="star" size={12} color={C.gold} />
        <Text style={styles.rating}>{book.rating === null ? 'Chưa có đánh giá' : book.rating.toFixed(1)}</Text>
        <Text style={styles.dot}>·</Text>
        <Text numberOfLines={1} style={styles.category}>{book.categoryLabel}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { paddingBottom: 7 },
  price: { position: 'absolute', bottom: 8, left: 8, borderRadius: 5, paddingHorizontal: 7, paddingVertical: 4, backgroundColor: '#202531C9' },
  priceText: { color: '#FFFFFF', fontSize: 9, fontWeight: '600' },
  title: { color: C.text, fontSize: 13, fontWeight: '700', lineHeight: 19, marginTop: 11, minHeight: 38 },
  author: { color: C.secondary, fontSize: 11, lineHeight: 17, marginTop: 2 },
  metadata: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 },
  rating: { color: C.gold, fontSize: 10, fontWeight: '700' },
  dot: { color: '#B4B8C1', marginHorizontal: 2 },
  category: { color: C.secondary, fontSize: 10, flexShrink: 1 },
});
