import type { CatalogBook } from "@/shared/types/catalog.types";
import { toBookPreview } from "./catalog.mapper";

export function toFavoritePreview(book: CatalogBook) {
  return {
    ...toBookPreview(book),
    // Missing metadata in the favorites response does not imply multiple authors.
    author: (book.authors ?? [])
      .map(({ author }) => author.fullName?.trim())
      .filter(Boolean)
      .join(", "),
  };
}
