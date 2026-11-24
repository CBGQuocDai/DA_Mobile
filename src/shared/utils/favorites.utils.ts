import type { CatalogBook } from "@/shared/types/catalog.types";

const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");

export function filterFavoriteBooks(
  books: CatalogBook[],
  query: string,
  order: "asc" | "desc",
) {
  const keyword = normalize(query);
  return books
    .filter((book) => normalize(book.title).includes(keyword))
    .sort((a, b) => {
      const byTitle = a.title.localeCompare(b.title, "vi") || a.id - b.id;
      return order === "asc" ? byTitle : -byTitle;
    });
}
