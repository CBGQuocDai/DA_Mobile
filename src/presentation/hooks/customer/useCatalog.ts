import { queryOptions, useQuery } from '@tanstack/react-query';

import { catalogService } from '@/infrastructure/api/services/catalog.service';
import { toBookPreview } from '@/presentation/mappers/catalog.mapper';
import type { PageResponse } from '@/shared/types/api.types';
import type { CatalogBook, CatalogParams } from '@/shared/types/catalog.types';

const selectBooks = (page: PageResponse<CatalogBook>) => page.content.map(toBookPreview);

export const catalogQueryOptions = (params: CatalogParams) => queryOptions({
  queryKey: ['catalog', params],
  queryFn: ({ signal }) => catalogService.getBooks(params, signal),
  select: selectBooks,
});

export function useCatalog(params: CatalogParams) {
  const query = useQuery(catalogQueryOptions(params));

  return {
    books: query.data ?? [],
    isLoading: query.isPending,
    error: query.isError ? 'Không thể tải danh sách sách. Vui lòng thử lại.' : null,
    reload: () => { void query.refetch(); },
  };
}
