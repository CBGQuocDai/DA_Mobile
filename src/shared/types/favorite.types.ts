import type { CatalogBook } from "./catalog.types";

export interface FavoriteBookState {
  isFavorite: boolean | null;
  isBusy: boolean;
  error: string | null;
}

export interface FavoritesSnapshot {
  sessionId: number;
  userId: string | null;
  books: CatalogBook[] | null;
  isLoading: boolean;
  error: string | null;
  states: Record<string, FavoriteBookState>;
}
