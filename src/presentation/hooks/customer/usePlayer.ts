import { useSyncExternalStore } from "react";
import { playerStore } from "@/presentation/stores/player.store";

export function usePlayer() {
  const snapshot = useSyncExternalStore(
    playerStore.subscribe,
    playerStore.getSnapshot,
    playerStore.getServerSnapshot,
  );
  return {
    ...snapshot,
    chapter: snapshot.chapters[snapshot.chapterIndex] ?? null,
    open: playerStore.open,
    selectChapter: playerStore.selectChapter,
    previous: playerStore.previous,
    next: playerStore.next,
    toggle: playerStore.toggle,
    seek: playerStore.seek,
    setRate: playerStore.setRate,
    setSleepTimer: playerStore.setSleepTimer,
    toggleBookmark: playerStore.toggleBookmark,
    clearNotice: playerStore.clearNotice,
    close: playerStore.close,
    retry: playerStore.retry,
  };
}
