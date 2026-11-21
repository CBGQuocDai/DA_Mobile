import { useState } from 'react';
import { useRouter } from 'expo-router';
import type { BookChapterPreview, BookDetailPreview } from '@/presentation/components/customer/bookDetail/bookDetail.types';
import { playerRoute, toPlayerBook } from '@/presentation/utils/player.utils';
import { usePlayer } from './usePlayer';

export function useBookDetailInteractions(book: BookDetailPreview) {
  const router = useRouter();
  const player = usePlayer();
  const [isFavorite, setFavorite] = useState(false);
  const [purchaseNotice, setPurchaseNotice] = useState(false);
  const activeChapter = player.book?.id === book.id ? player.chapter : null;

  const selectChapter = (chapter: BookChapterPreview) => {
    if (!(chapter.canPlay ?? chapter.isFree)) { setPurchaseNotice(true); return; }
    const selectedBook = toPlayerBook(book);
    void player.open(book.id, chapter.id, true, selectedBook);
    router.push(playerRoute(selectedBook, chapter.id));
  };

  return {
    isFavorite, activeChapter, isPlaying: Boolean(activeChapter && player.isPlaying), purchaseNotice, hasPlayer: Boolean(player.chapter),
    toggleFavorite: () => setFavorite((value) => !value),
    selectChapter,
    startPreview: () => {
      const selectedBook = toPlayerBook(book);
      void player.open(book.id, 'resume', true, selectedBook);
      router.push(playerRoute(selectedBook, 'resume'));
    },
    openPurchaseNotice: () => setPurchaseNotice(true),
    closePurchaseNotice: () => setPurchaseNotice(false),
  };
}
