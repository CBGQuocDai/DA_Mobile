import type { CatalogBook } from "@/shared/types/catalog.types";

export interface FavoritesRepository {
  list(token: string, signal?: AbortSignal): Promise<CatalogBook[]>;
  check(bookId: string, token: string, signal?: AbortSignal): Promise<boolean>;
  toggle(bookId: string, token: string, signal?: AbortSignal): Promise<boolean>;
}
