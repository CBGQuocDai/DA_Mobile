import { StyleSheet } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import Animated, { interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { BookCover } from '@/presentation/components/customer/book/BookCover';
import type { BookPreview } from '@/presentation/components/customer/book/book.types';
import { getCarouselOffset } from '@/shared/utils/carousel.utils';

interface BookshelfBookProps {
  book: BookPreview;
  bookIndex: number;
  selectedIndex: number;
  count: number;
  position: SharedValue<number>;
  width: number;
  stageWidth: number;
  offset: number;
  onPress: () => void;
}

export function BookshelfBook({ book, bookIndex, selectedIndex, count, position, width, stageWidth, offset, onPress }: BookshelfBookProps) {
  const isSelected = bookIndex === selectedIndex;
  const isVisible = Math.abs(getCarouselOffset(bookIndex, selectedIndex, count)) <= 1;
  const animatedStyle = useAnimatedStyle(() => {
    // Two books move between two slots without wrapping a visible cover across the stage.
    const distance = count === 2 ? bookIndex - position.value : getCarouselOffset(bookIndex, position.value, count);
    const magnitude = Math.abs(distance);

    return {
      opacity: interpolate(magnitude, [0, 1, count === 3 ? 1.5 : 1.8], [1, 1, 0], 'clamp'),
      zIndex: Math.round(100 - magnitude * 30),
      transform: [
        { translateX: distance * offset },
        { translateY: interpolate(magnitude, [0, 1, 2], [0, 6, 18], 'clamp') },
        { scale: interpolate(magnitude, [0, 1, 2], [1, 0.76, 0.56], 'clamp') },
      ],
    };
  });

  return (
    <Animated.View pointerEvents={isVisible ? 'auto' : 'none'}
      accessibilityElementsHidden={!isVisible} importantForAccessibility={isVisible ? 'auto' : 'no-hide-descendants'}
      aria-hidden={!isVisible}
      style={[styles.book, { left: (stageWidth - width) / 2, width, height: width * 1.5 }, animatedStyle]}>
      <Pressable accessibilityRole="button" accessibilityLabel={`${isSelected ? 'Xem giới thiệu' : 'Chọn sách'} ${book.title}`}
        onPress={onPress} style={styles.pressable}>
        <BookCover book={book} width={width} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  book: { position: 'absolute', top: 1, borderRadius: 9, boxShadow: '0px 10px 27px rgba(139, 73, 86, 0.2)', outlineColor: '#FFFFFF99', outlineWidth: 3 },
  pressable: { flex: 1, borderRadius: 9 },
});
