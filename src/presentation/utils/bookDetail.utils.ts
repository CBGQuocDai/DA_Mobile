import type { BookPreview } from '@/presentation/components/customer/book/book.types';
import type { BookReviewPreview } from '@/presentation/components/customer/bookDetail/bookDetail.types';

/** Keep the selected book's public identity across a web refresh; detail content stays mocked. */
export const bookDetailRoute = (book: Pick<BookPreview, 'id' | 'title' | 'author' | 'categoryLabel' | 'price'>) => ({
  pathname: '/book/[id]' as const,
  params: { id: book.id, title: book.title, author: book.author, category: book.categoryLabel,
    ...(book.price !== null ? { price: String(book.price) } : {}) },
});

export function formatListeningDuration(seconds: number) {
  const minutes = Math.round(seconds / 60);
  const hours = Math.floor(minutes / 60);
  return hours ? `${hours} giờ${minutes % 60 ? ` ${minutes % 60} phút` : ''}` : `${minutes} phút`;
}

export function formatAudioClock(seconds: number) {
  const value = Math.max(0, Math.floor(seconds));
  return `${Math.floor(value / 60).toString().padStart(2, '0')}:${(value % 60).toString().padStart(2, '0')}`;
}

export const formatBookPrice = (price: number | null) => price === null ? 'Chưa có giá' : price === 0 ? 'Miễn phí' : `${price.toLocaleString('vi-VN')}đ`;

export function reviewSummary(reviews: BookReviewPreview[]) {
  const distribution = [5, 4, 3, 2, 1].map((rating) => ({ rating, count: reviews.filter((review) => review.rating === rating).length }));
  return { total: reviews.length, average: reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0, distribution };
}
