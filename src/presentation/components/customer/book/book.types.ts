export type BookCategoryId = 'literature' | 'growth' | 'business' | 'mindfulness';

/** Presentation model; API responses are mapped before reaching components. */
export interface BookPreview {
  id: string;
  title: string;
  coverTitle: string;
  author: string;
  category: string;
  categoryLabel: string;
  rating: number | null;
  duration?: string;
  price: number | null;
  description: string;
  cover: { source?: number; uri?: string; background: string; ink: string };
}
