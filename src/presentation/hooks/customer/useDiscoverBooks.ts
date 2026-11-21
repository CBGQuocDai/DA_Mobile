import { queryOptions, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { categoryService } from '@/infrastructure/api/services/category.service';
import { useDebouncedValue } from '@/presentation/hooks/common/useDebouncedValue';
import { toBookPreview } from '@/presentation/mappers/catalog.mapper';
import type { PageResponse } from '@/shared/types/api.types';
import type { CatalogBook, CatalogParams } from '@/shared/types/catalog.types';
import { catalogQueryOptions } from './useCatalog';

const PAGE_SIZE = 12;
const selectPage = (page: PageResponse<CatalogBook>) => ({
  books: page.content.map(toBookPreview), total: page.total, totalPage: page.totalPage, page: page.page,
});

export const discoveryQueryOptions = (params: CatalogParams) => ({ ...catalogQueryOptions(params), select: selectPage });
export const categoriesQueryOptions = () => queryOptions({
  queryKey: ['categories'],
  queryFn: ({ signal }) => categoryService.getCategories(signal),
});

export function useDiscoverBooks() {
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const bookName = useDebouncedValue(query.trim());
  const catalog = useQuery(discoveryQueryOptions({
    page, size: PAGE_SIZE, bookName: bookName || undefined, categoryId: categoryId ?? undefined,
  }));
  const categories = useQuery(categoriesQueryOptions());
  const isLoading = catalog.isPending || query.trim() !== bookName;

  return {
    query, categoryId, page,
    books: catalog.data?.books ?? [],
    total: catalog.data?.total ?? 0,
    totalPage: catalog.data?.totalPage ?? 0,
    categories: categories.data ?? [],
    isLoading,
    isCategoriesLoading: categories.isPending,
    error: catalog.isError ? 'Không thể tải danh sách sách. Vui lòng thử lại.' : null,
    categoriesError: categories.isError ? 'Không thể tải thể loại sách.' : null,
    setQuery: (value: string) => { setQuery(value); setPage(0); },
    setCategory: (value: number | null) => { setCategoryId(value); setPage(0); },
    clearFilters: () => { setQuery(''); setCategoryId(null); setPage(0); },
    goToPage: (value: number) => {
      if (!isLoading && !catalog.isFetching && value >= 0 && value < (catalog.data?.totalPage ?? 0)) setPage(value);
    },
    reload: () => { void catalog.refetch(); },
    reloadCategories: () => { void categories.refetch(); },
  };
}
