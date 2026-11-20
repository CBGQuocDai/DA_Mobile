import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { interpolate, interpolateColor, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { AppIcon } from '@/presentation/components/common/AppIcon';
import type { BookPreview } from '@/presentation/components/customer/book/book.types';
import { useBookshelfCarousel } from '@/presentation/hooks/customer/useBookshelfCarousel';
import { CustomerTheme as C } from '@/shared/constants/customerTheme.constants';
import { getCarouselOffset } from '@/shared/utils/carousel.utils';
import { BookshelfBook } from './BookshelfBook';

interface BookshelfCarouselProps {
  books: BookPreview[];
  width: number;
  onSelectBook: (book: BookPreview) => void;
}

/** Remounted when book IDs change, so selection stays in bounds after a refresh. */
export function BookshelfCarousel({ books, width, onSelectBook }: BookshelfCarouselProps) {
  const coverWidth = Math.min(136, width * 0.4);
  const offset = coverWidth * 0.82;
  const { index, position, gesture, move, select } = useBookshelfCarousel(books.length, offset);
  const book = books[index];

  return (
    <>
      <GestureDetector gesture={gesture} touchAction="pan-y">
        <View style={[styles.stage, { height: coverWidth * 1.5 + 31 }]}>
          <View style={styles.shelfShadow} />
          <View style={styles.shelf} />
          {books.map((item, bookIndex) => (
            <BookshelfBook key={item.id} book={item} bookIndex={bookIndex} selectedIndex={index}
              count={books.length} position={position} width={coverWidth} stageWidth={width} offset={offset}
              onPress={() => bookIndex === index ? onSelectBook(item) : select(bookIndex)} />
          ))}
        </View>
      </GestureDetector>

      <View style={styles.bookInfo} accessibilityLiveRegion="polite">
        <Text numberOfLines={1} style={styles.bookTitle}>{book.title}</Text>
        <Text numberOfLines={1} style={styles.author}>{book.author}</Text>
      </View>
      {books.length > 1 && <View style={styles.controls}>
        <Pressable accessibilityRole="button" accessibilityLabel="Sách nổi bật trước" onPress={() => move(-1)} hitSlop={8}
          style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}>
          <AppIcon name="chevronLeft" size={17} color={C.accent} />
        </Pressable>
        <View style={styles.dots}>
          {books.map((item, dotIndex) => (
            <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`Sách nổi bật ${dotIndex + 1}: ${item.title}`}
              accessibilityState={{ selected: dotIndex === index }} onPress={() => select(dotIndex)} hitSlop={8}>
              <BookshelfDot index={dotIndex} count={books.length} position={position} />
            </Pressable>
          ))}
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Sách nổi bật kế tiếp" onPress={() => move(1)} hitSlop={8}
          style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}>
          <AppIcon name="chevronRight" size={17} color={C.accent} />
        </Pressable>
      </View>}
    </>
  );
}

function BookshelfDot({ index, count, position }: { index: number; count: number; position: SharedValue<number> }) {
  const animatedStyle = useAnimatedStyle(() => {
    const distance = Math.abs(getCarouselOffset(index, position.value, count));
    return {
      width: interpolate(distance, [0, 1], [17, 5], 'clamp'),
      backgroundColor: interpolateColor(Math.min(distance, 1), [0, 1], [C.accent, '#DFB9C3']),
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const styles = StyleSheet.create({
  stage: { marginTop: 17 },
  shelf: { position: 'absolute', left: '7%', right: '7%', bottom: 13, height: 12, backgroundColor: '#EABAC6', borderRadius: 100, borderTopWidth: 3, borderTopColor: '#F4D4DC', boxShadow: '0px 10px 20px rgba(175, 74, 102, 0.14)' },
  shelfShadow: { position: 'absolute', width: '65%', height: 18, backgroundColor: '#C88C9D20', borderRadius: 100, left: '17.5%', bottom: 5 },
  bookInfo: { alignItems: 'center', paddingHorizontal: 24, marginTop: 1, gap: 4 },
  bookTitle: { color: C.text, fontSize: 13, fontWeight: '700' },
  author: { color: '#9B8087', fontSize: 10 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 23, marginTop: 13 },
  arrow: { width: 31, height: 31, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFFCC', borderWidth: 1, borderColor: '#FFFFFF' },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#DFB9C3' },
  pressed: { opacity: 0.55 },
});
