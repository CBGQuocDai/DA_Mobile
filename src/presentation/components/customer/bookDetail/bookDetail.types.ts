import type { BookPreview } from '../book/book.types';
import type { PlayerChapter } from '@/shared/types/player.types';

export type BookChapterPreview = PlayerChapter;

export interface BookReviewPreview {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface BookDetailPreview extends BookPreview {
  isDemo?: boolean;
  purchased?: boolean;
  narrator: string;
  language: string;
  tags: string[];
  chapters: BookChapterPreview[];
  reviews: BookReviewPreview[];
  relatedBooks: BookPreview[];
}

export type BookDetailSection = 'introduction' | 'chapters' | 'reviews' | 'related';
