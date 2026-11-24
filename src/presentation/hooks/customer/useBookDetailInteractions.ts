import { useState } from "react";
import { useRouter } from "expo-router";
import type {
  BookChapterPreview,
  BookDetailPreview,
} from "@/presentation/components/customer/bookDetail/bookDetail.types";
import { playerRoute, toPlayerBook } from "@/presentation/utils/player.utils";
import { usePlayer } from "./usePlayer";
import { useBookFavorite } from "./useBookFavorite";

export function useBookDetailInteractions(book: BookDetailPreview) {
  const router = useRouter();
  const player = usePlayer();
  const favorite = useBookFavorite(book.id, book.isDemo);
  const [purchaseNotice, setPurchaseNotice] = useState(false);
  const activeChapter = player.book?.id === book.id ? player.chapter : null;

  const selectChapter = (chapter: BookChapterPreview) => {
    if (!(chapter.canPlay ?? chapter.isFree)) {
      setPurchaseNotice(true);
      return;
    }
    const selectedBook = toPlayerBook(book);
    void player.open(book.id, chapter.id, true, selectedBook);
    router.push(playerRoute(selectedBook, chapter.id));
  };

  return {
    isFavorite: favorite.isFavorite,
    isFavoriteBusy: favorite.isBusy,
    isFavoriteDisabled: favorite.isDisabled,
    favoriteError: favorite.error,
    activeChapter,
    isPlaying: Boolean(activeChapter && player.isPlaying),
    purchaseNotice,
    hasPlayer: Boolean(player.chapter),
    toggleFavorite: favorite.toggle,
    selectChapter,
    startPreview: () => {
      const selectedBook = toPlayerBook(book);
      void player.open(book.id, "resume", true, selectedBook);
      router.push(playerRoute(selectedBook, "resume"));
    },
    openPurchaseNotice: () => setPurchaseNotice(true),
    closePurchaseNotice: () => setPurchaseNotice(false),
  };
}
