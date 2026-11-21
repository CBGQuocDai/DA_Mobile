import type { BookPreview } from '@/presentation/components/customer/book/book.types';
import type { PlayerBook } from '@/shared/types/player.types';

export const toPlayerBook = ({ id, title, coverTitle, author, categoryLabel, price, cover }: BookPreview): PlayerBook =>
  ({ id, title, coverTitle, author, categoryLabel, price, cover: { ...cover } });

export const playerRoute = (book: PlayerBook, chapterId: string) => ({
  pathname: '/player/[chapterId]' as const,
  params: { chapterId, bookId: book.id, title: book.title, author: book.author, category: book.categoryLabel,
    ...(book.price !== null ? { price: String(book.price) } : {}) },
});
