import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { authorService } from "@/infrastructure/api/services/author.service";
import { useSearchTerm } from "@/presentation/hooks/common/useSearchTerm";

export const authorSearchQueryOptions = (keyword: string) =>
  infiniteQueryOptions({
    queryKey: ["author-search", keyword],
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) =>
      authorService.searchAuthors(
        { keyword: keyword || undefined, page: pageParam, size: 10 },
        signal,
      ),
    getNextPageParam: (lastPage) =>
      lastPage.content.length > 0 && lastPage.page + 1 < lastPage.totalPage
        ? lastPage.page + 1
        : undefined,
  });

export function useAuthorSearch() {
  const term = useSearchTerm();
  const authors = useInfiniteQuery({
    ...authorSearchQueryOptions(term.keyword),
    enabled: !term.isDebouncing,
  });
  const items = useMemo(
    () =>
      Array.from(
        new Map(
          authors.data?.pages.flatMap((page) =>
            page.content.map((author) => [author.id, author] as const),
          ),
        ).values(),
      ),
    [authors.data],
  );

  return {
    ...term,
    authors: term.isDebouncing ? [] : items,
    isLoading: term.isDebouncing || authors.isPending,
    isFetching: authors.isFetching,
    isFetchingNextPage: authors.isFetchingNextPage,
    isNextPageError: authors.isFetchNextPageError,
    hasNextPage: authors.hasNextPage,
    error:
      authors.isError && !authors.isFetchNextPageError
        ? "Không thể tải danh sách tác giả."
        : null,
    reload: () => {
      if (!term.isDebouncing) void authors.refetch();
    },
    loadMore: () => {
      if (!term.isDebouncing && authors.hasNextPage && !authors.isFetching)
        void authors.fetchNextPage();
    },
  };
}
