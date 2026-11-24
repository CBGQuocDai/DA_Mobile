import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { favoritesStore } from "@/presentation/stores/favorites.store";

export function useFavoritesSnapshot() {
  return useSyncExternalStore(
    favoritesStore.subscribe,
    favoritesStore.getSnapshot,
    favoritesStore.getServerSnapshot,
  );
}

export function useFavoriteBooks() {
  const snapshot = useFavoritesSnapshot();
  const [notice, setNotice] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusVersion = useRef(0);
  const focused = useRef(false);
  const clearNotice = useCallback(() => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
    setNotice(null);
  }, []);

  useFocusEffect(
    useCallback(() => {
      focused.current = true;
      focusVersion.current += 1;
      clearNotice();
      if (snapshot.userId) void favoritesStore.load();
      return () => {
        focused.current = false;
        focusVersion.current += 1;
        clearNotice();
      };
    }, [snapshot.sessionId, snapshot.userId, clearNotice]),
  );

  const remove = useCallback(
    async (id: string) => {
      if (!focused.current || !snapshot.userId) return;
      const version = focusVersion.current;
      await favoritesStore.setFavorite(id, false);
      const current = favoritesStore.getSnapshot();
      // A delayed operation must not bring feedback into a later screen visit/session.
      if (
        !focused.current ||
        focusVersion.current !== version ||
        current.sessionId !== snapshot.sessionId ||
        current.states[id]?.isFavorite !== false ||
        current.states[id]?.error
      )
        return;
      clearNotice();
      setNotice("Đã bỏ yêu thích sách.");
      timer.current = setTimeout(clearNotice, 500);
    },
    [snapshot.sessionId, snapshot.userId, clearNotice],
  );

  return { ...snapshot, notice, reload: favoritesStore.load, remove };
}
