import { useQuery } from '@tanstack/react-query';
import { mapPlaybackDetails } from '@/application/player/playback.mapper';
import { playbackService } from '@/infrastructure/api/services/playback.service';
import { createBookDetailPreview } from '@/presentation/components/customer/bookDetail/bookDetail.mock';
import type { BookDetailPreview } from '@/presentation/components/customer/bookDetail/bookDetail.types';
import { toBookPreview } from '@/presentation/mappers/catalog.mapper';
import { authStore } from '@/presentation/stores/auth.store';
import { useCustomerAuth } from './useCustomerAuth';

export function useCustomerBookDetail(id: string) {
  const auth = useCustomerAuth();
  const isDemo = !/^[1-9]\d*$/.test(id);
  const query = useQuery({
    queryKey: ['book-playback', id, auth.user?.id ?? 'guest'],
    enabled: !isDemo && auth.isReady,
    queryFn: ({ signal }) => playbackService.getDetails(id, auth.user ? authStore.getAccessToken() : null, signal),
    staleTime: 0,
    gcTime: 0, // Signed audio URLs are fetched again when opening the player.
    retry: false,
  });
  let book: BookDetailPreview | null = isDemo ? createBookDetailPreview(id) : null;
  if (query.data) {
    const { overview } = query.data;
    const identity = toBookPreview(overview.book);
    const samples = createBookDetailPreview(id, identity);
    book = { ...samples, ...identity, chapters: mapPlaybackDetails(query.data).chapters,
      narrator: overview.book.voice?.name || overview.book.voice?.voiceName || 'Giọng đọc của sách',
      tags: identity.categoryLabel.split('·').map((tag) => tag.trim()),
      purchased: query.data.purchased, isDemo: false };
  }
  return { book, isLoading: !isDemo && (!auth.isReady || query.isPending),
    error: query.error?.message ?? null, retry: () => { void query.refetch(); } };
}
