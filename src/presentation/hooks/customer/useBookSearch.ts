import {
  infiniteQueryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

import { catalogService } from "@/infrastructure/api/services/catalog.service";
import { useSearchTerm } from "@/presentation/hooks/common/useSearchTerm";
import { toBookPreview } from "@/presentation/mappers/catalog.mapper";
import type {
  CatalogAuthor,
  CatalogCategory,
  CatalogParams,
} from "@/shared/types/catalog.types";
import { categoriesQueryOptions } from "./useDiscoverBooks";

export const bookSearchQueryOptions = (
  filters: Omit<CatalogParams, "page" | "size">,
) =>
  infiniteQueryOptions({
    // Infinite queries must not share the single-page catalog's cache shape.
    queryKey: ["book-search", filters],
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) =>
      catalogService.getBooks(
        { ...filters, page: pageParam, size: 12 },
        signal,
      ),
    getNextPageParam: (lastPage) =>
      lastPage.content.length > 0 && lastPage.page + 1 < lastPage.totalPage
        ? lastPage.page + 1
        : undefined,
  });

export function useBookSearch(initialQuery = "") {
  const term = useSearchTerm(initialQuery);
  const [category, setCategory] = useState<CatalogCategory | null>(null);
  const [author, setAuthor] = useState<CatalogAuthor | null>(null);
  const catalog = useInfiniteQuery({
    ...bookSearchQueryOptions({
      bookName: term.keyword || undefined,
      categoryId: category?.id,
      authorId: author?.id,
    }),
    enabled: !term.isDebouncing,
  });
  const categories = useQuery(categoriesQueryOptions());
  const books = useMemo(
    () =>
      Array.from(
        new Map(
          catalog.data?.pages.flatMap((page) =>
            page.content.map((book) => [book.id, toBookPreview(book)] as const),
          ),
        ).values(),
      ),
    [catalog.data],
  );
  const { applyQuery } = term;
  const reset = useCallback(
    (query = "") => {
      applyQuery(query);
      setCategory(null);
      setAuthor(null);
    },
    [applyQuery],
  );

  return {
    ...term,
    category,
    author,
    setCategory,
    setAuthor,
    reset,
    clearFilters: () => {
      setCategory(null);
      setAuthor(null);
    },
    books: term.isDebouncing ? [] : books,
    total: catalog.data?.pages[0]?.total ?? 0,
    isLoading: term.isDebouncing || catalog.isPending,
    isFetching: catalog.isFetching,
    isRefreshing: catalog.isRefetching && !catalog.isFetchingNextPage,
    isFetchingNextPage: catalog.isFetchingNextPage,
    isNextPageError: catalog.isFetchNextPageError,
    hasNextPage: catalog.hasNextPage,
    error:
      catalog.isError && !catalog.isFetchNextPageError
        ? "Không thể tải danh sách sách. Vui lòng thử lại."
        : null,
    reload: () => {
      if (!term.isDebouncing) void catalog.refetch();
    },
    loadMore: () => {
      if (!term.isDebouncing && catalog.hasNextPage && !catalog.isFetching)
        void catalog.fetchNextPage();
    },
    categories: categories.data ?? [],
    isCategoriesLoading: categories.isPending,
    categoriesError: categories.isError ? "Không thể tải thể loại sách." : null,
    reloadCategories: () => {
      void categories.refetch();
    },
  };
}
