import { useCallback, useState } from 'react';
import { usePanGesture } from 'react-native-gesture-handler';
import { cancelAnimation, clamp, useSharedValue, withSpring } from 'react-native-reanimated';
import { scheduleOnRN, scheduleOnUI } from 'react-native-worklets';

import { getCarouselOffset, wrapCarouselIndex } from '@/shared/utils/carousel.utils';

const SNAP_SPRING = { stiffness: 210, damping: 26, mass: 1, overshootClamping: true };

export function useBookshelfCarousel(count: number, step: number) {
  const [index, setIndex] = useState(0);
  // Keep position continuous across the last/first book so looping never jumps.
  const position = useSharedValue(0);
  const target = useSharedValue(0);
  const dragStart = useSharedValue(0);
  const itemCount = Math.max(count, 1);

  const snapTo = useCallback((next: number, velocity = 0) => {
    'worklet';
    const destination = count === 2 ? wrapCarouselIndex(next, itemCount) : next;
    target.value = destination;
    position.value = withSpring(destination, { ...SNAP_SPRING, velocity });
    scheduleOnRN(setIndex, wrapCarouselIndex(destination, itemCount));
  }, [count, itemCount, position, target]);

  const gesture = usePanGesture({
    enabled: count > 1,
    activeOffsetX: [-12, 12],
    failOffsetY: [-10, 10],
    maxPointers: 1,
    onActivate: () => {
      'worklet';
      cancelAnimation(position);
      dragStart.value = position.value;
    },
    onUpdate: (event) => {
      'worklet';
      const next = dragStart.value - clamp(event.translationX / step, -1, 1);
      position.value = count === 2 ? clamp(next, 0, 1) : next;
    },
    onDeactivate: (event) => {
      'worklet';
      if (event.canceled) {
        snapTo(target.value);
        return;
      }

      const start = Math.round(dragStart.value);
      const velocity = clamp(-event.velocityX / step, -6, 6);
      const projected = position.value + velocity * 0.16;
      const next = clamp(Math.round(projected), start - 1, start + 1);
      snapTo(count === 2 ? clamp(next, 0, 1) : next, velocity);
    },
  });

  const move = useCallback((direction: number) => {
    if (count < 2) return;
    scheduleOnUI(() => {
      'worklet';
      snapTo(target.value + direction);
    });
  }, [count, snapTo, target]);

  const select = useCallback((nextIndex: number) => {
    if (count < 2) return;
    scheduleOnUI(() => {
      'worklet';
      snapTo(target.value + getCarouselOffset(nextIndex, target.value, itemCount));
    });
  }, [count, itemCount, snapTo, target]);

  return { index, position, gesture, move, select };
}
