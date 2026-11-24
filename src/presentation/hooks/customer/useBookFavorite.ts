import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { favoritesStore } from "@/presentation/stores/favorites.store";
import { useCustomerAuth } from "./useCustomerAuth";
import { useFavoritesSnapshot } from "./useFavoriteBooks";

export function useBookFavorite(bookId: string, isDemo = false) {
  const router = useRouter();
  const auth = useCustomerAuth();
  const snapshot = useFavoritesSnapshot();
  const valid = !isDemo && /^[1-9]\d*$/.test(bookId);
  const state = snapshot.states[bookId];
  useFocusEffect(
    useCallback(() => {
      if (valid && snapshot.userId) void favoritesStore.check(bookId);
    }, [bookId, valid, snapshot.sessionId, snapshot.userId]),
  );

  return {
    isFavorite: state?.isFavorite === true,
    isBusy: !auth.isReady || Boolean(state?.isBusy),
    isDisabled: !valid,
    error: !valid
      ? "Sách minh họa chưa hỗ trợ lưu yêu thích."
      : (state?.error ?? null),
    toggle: () => {
      if (!valid || !auth.isReady || state?.isBusy) return;
      if (!auth.user) {
        router.push({
          pathname: "/(auth)/login",
          params: { returnTo: `/book/${bookId}` },
        });
      } else if (
        state?.isFavorite === null ||
        state?.isFavorite === undefined
      ) {
        void favoritesStore.check(bookId);
      } else {
        void favoritesStore.setFavorite(bookId, !state.isFavorite);
      }
    },
  };
}
