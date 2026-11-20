import type { BookPreview } from '@/presentation/components/customer/book/book.types';
import type { CatalogBook } from '@/shared/types/catalog.types';

export function toBookPreview(book: CatalogBook): BookPreview {
  const authors = (book.authors ?? []).map(({ author }) => author.fullName?.trim()).filter(Boolean);
  const categories = (book.categories ?? []).map(({ category }) => category);

  return {
    id: String(book.id),
    title: book.title,
    coverTitle: book.title,
    author: authors.join(', ') || 'Nhiều tác giả',
    category: categories[0] ? String(categories[0].id) : '',
    categoryLabel: categories.map(({ name }) => name).join(' · ') || 'Sách nói',
    rating: book.ratingCount === 0 ? null : book.averageRating ?? null,
    // The catalog does not return total listening duration.
    price: book.price ?? null,
    description: book.description?.trim() || 'Chưa có giới thiệu cho cuốn sách này.',
    cover: { uri: book.coverImage?.url || undefined, background: '#FFF1F2', ink: '#713B4C' },
  };
}
