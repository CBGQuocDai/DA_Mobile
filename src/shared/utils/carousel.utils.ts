export function wrapCarouselIndex(index: number, count: number) {
  'worklet';
  return ((index % count) + count) % count;
}

/** Signed distance to an item, taking the shortest route around the carousel. */
export function getCarouselOffset(index: number, position: number, count: number) {
  'worklet';
  return wrapCarouselIndex(index - position + count / 2, count) - count / 2;
}
