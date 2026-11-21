/** Public BookController catalog response; no playback or admin content is requested. */
export interface CatalogBook {
  id: number;
  title: string;
  description?: string | null;
  price?: number | null;
  coverImage?: { path: string; url: string } | null;
  status: 'PROCESSING' | 'UNPUBLISHED' | 'PUBLISHED' | 'FAILED';
  authors?: { id: number; author: { id: number; fullName?: string | null } }[] | null;
  categories?: { id: number; category: { id: number; name: string } }[] | null;
  averageRating?: number | null;
  ratingCount?: number | null;
}

export interface CatalogParams {
  page: number;
  size: number;
  bookName?: string;
  categoryId?: number;
  authorId?: number;
}

export interface CatalogCategory {
  id: number;
  name: string;
  description?: string | null;
}
