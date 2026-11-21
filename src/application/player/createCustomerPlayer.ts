import {
  PLAYBACK_RATES,
  type PlaybackRate,
  type PlayerBook,
  type PlayerSnapshot,
} from "@/shared/types/player.types";
import { createListeningProgress } from "./createListeningProgress";
import { mapPlaybackDetails } from "./playback.mapper";
import type {
  AudioEngine,
  AudioStatus,
  PlaybackRepository,
  PlayerSession,
} from "./player.ports";

export function createCustomerPlayer(
  repository: PlaybackRepository,
  audio: AudioEngine,
  session: PlayerSession,
  now = Date.now,
) {
  const initial: PlayerSnapshot = {
    book: null,
    chapters: [],
    chapterIndex: 0,
    position: 0,
    isPlaying: false,
    rate: 1,
    sleepEndsAt: null,
    bookmarked: false,
    notice: null,
    isLoading: false,
    isBuffering: false,
    error: null,
    progressError: null,
    isSaving: false,
    savesProgress: false,
  };
  let state = initial;
  let revision = 0;
  let seekRevision = 0;
  let ready = false;
  let seeking = false;
  let controller: AbortController | null = null;
  let activeIdentity: string | null | undefined;
  let attempt: {
    bookId: string;
    chapterId: string;
    autoPlay: boolean;
    hint?: PlayerBook;
  } | null = null;
  let progress: ReturnType<typeof createListeningProgress> | null = null;
  let unsubscribeProgress: (() => void) | null = null;
  const queues = new Map<string, ReturnType<typeof createListeningProgress>>();
  const listeners = new Set<() => void>();
  const patch = (next: Partial<PlayerSnapshot>) => {
    state = { ...state, ...next };
    listeners.forEach((listener) => listener());
  };
  const active = () => state.chapters[state.chapterIndex];
  const checkpoint = (complete = false) => {
    const chapter = active();
    if (!ready || !chapter || !progress) return;
    progress.checkpoint(
      Number(chapter.id),
      state.chapterIndex,
      Math.max(0, Math.min(Math.floor(state.position), chapter.duration)),
      complete,
    );
  };
  const flushAll = (manual = false) =>
    Promise.all([...queues.values()].map((queue) => queue.flush(manual))).then(
      () => {
        // Keep failed queues through navigation, and discard successful inactive sessions.
        for (const [key, queue] of queues)
          if (queue !== progress && !queue.hasPending()) queues.delete(key);
      },
    );
  const pause = () => {
    audio.pause();
    patch({ isPlaying: false });
    checkpoint();
    void flushAll();
  };
  const close = () => {
    checkpoint();
    ++revision;
    ++seekRevision;
    controller?.abort();
    ready = false;
    seeking = false;
    audio.unload();
    unsubscribeProgress?.();
    unsubscribeProgress = null;
    progress = null;
    attempt = null;
    activeIdentity = undefined;
    state = initial;
    listeners.forEach((listener) => listener());
    void flushAll();
  };
  session.subscribe(() => {
    if (
      activeIdentity !== undefined &&
      session.getIdentity() !== activeIdentity
    )
      close();
  });

  const open = async (
    bookId: string,
    chapterId = "resume",
    autoPlay = true,
    hint?: PlayerBook,
  ): Promise<boolean> => {
    if (
      ready &&
      !state.error &&
      state.book?.id === bookId &&
      (chapterId === "resume" || active()?.id === chapterId)
    ) {
      if (autoPlay) await play();
      return true;
    }
    checkpoint();
    void flushAll();
    const operation = ++revision;
    ++seekRevision;
    controller?.abort();
    controller = new AbortController();
    ready = false;
    seeking = false;
    audio.unload();
    unsubscribeProgress?.();
    progress = null;
    attempt = { bookId, chapterId, autoPlay, hint };
    const sameBook = state.book?.id === bookId;
    patch({
      book: hint ?? (sameBook ? state.book : null),
      chapters: [],
      position: 0,
      chapterIndex: 0,
      isPlaying: false,
      isLoading: true,
      isBuffering: false,
      error: null,
      progressError: null,
      isSaving: false,
      savesProgress: false,
      notice: null,
      bookmarked: sameBook && state.bookmarked,
    });
    try {
      await session.initialize();
      if (operation !== revision) return false;
      activeIdentity = session.getIdentity();
      const token = activeIdentity ? session.getToken() : null;
      const details = mapPlaybackDetails(
        await repository.getDetails(bookId, token, controller.signal),
      );
      if (operation !== revision) return false;
      let saved: Awaited<
        ReturnType<ReturnType<typeof createListeningProgress>["prepareResume"]>
      > | null = null;
      if (token && activeIdentity) {
        const key = `${activeIdentity}/${bookId}`;
        let queue = queues.get(key);
        if (!queue) {
          queue = createListeningProgress(repository.progress(bookId, token));
          queues.set(key, queue);
        }
        progress = queue;
        unsubscribeProgress = queue.subscribe(() => {
          if (progress !== queue) return;
          const next = queue.getSnapshot();
          patch({ progressError: next.error, isSaving: next.isSaving });
        });
        saved = await queue.prepareResume();
        if (operation !== revision) return false;
      }
      const target =
        chapterId === "resume"
          ? String(
              saved?.resume?.chapterId ??
                details.chapters.find(
                  (c) => c.canPlay && c.status === "AUDIO_READY" && c.audioUrl,
                )?.id ??
                "",
            )
          : chapterId;
      const index = details.chapters.findIndex(
        (chapter) => chapter.id === target,
      );
      const chapter = details.chapters[index];
      patch({
        ...details,
        chapterIndex: Math.max(0, index),
        savesProgress: Boolean(token),
      });
      if (!chapter) throw new Error("Sách chưa có chương có thể nghe.");
      if (!chapter.canPlay)
        throw new Error(
          "Mua sách để nghe chương này. Bạn có thể nghe thử 3 chương đầu.",
        );
      if (
        chapter.status !== "AUDIO_READY" ||
        !chapter.audioUrl ||
        !Number.isFinite(chapter.duration) ||
        chapter.duration <= 0
      )
        throw new Error(
          "Audio của chương chưa sẵn sàng. Vui lòng thử lại sau.",
        );
      const entry = saved?.chapters.find(
        (item) => String(item.chapterId) === target,
      );
      const restored =
        chapterId === "resume" && saved?.resume
          ? saved.resume.lastPlayAt
          : entry?.isComplete && entry.lastPlayAt >= chapter.duration - 1
            ? 0
            : (entry?.lastPlayAt ?? 0);
      const position = Math.max(0, Math.min(restored, chapter.duration));
      let ended = false;
      const receive = (status: AudioStatus) => {
        if (operation !== revision || !ready || seeking) return;
        if (status.error) {
          checkpoint();
          ready = false;
          audio.pause();
          void flushAll();
          patch({
            isPlaying: false,
            error:
              "Không thể phát âm thanh. Thử tải lại audio hoặc kiểm tra kết nối.",
            isBuffering: false,
          });
          return;
        }
        const wasPlaying = state.isPlaying;
        const position = Number.isFinite(status.position)
          ? Math.max(0, Math.min(status.position, chapter.duration))
          : state.position;
        patch({
          position,
          isPlaying: status.playing,
          isBuffering: status.buffering,
        });
        if (wasPlaying && !status.playing && !status.buffering) {
          checkpoint();
          void flushAll();
        }
        if (status.ended && !ended) {
          ended = true;
          // A short/broken audio file must not mark a longer BE chapter complete.
          checkpoint(position >= chapter.duration - 1);
          void flushAll();
          const next = state.chapters[index + 1];
          if (next?.canPlay && next.status === "AUDIO_READY" && next.audioUrl)
            void open(bookId, next.id);
          else
            patch({
              isPlaying: false,
              notice: next
                ? "Bạn đã nghe hết các chương có thể phát."
                : "Bạn đã nghe hết cuốn sách.",
            });
        }
        if (!status.ended) ended = false;
      };
      await audio.load(chapter.audioUrl, details.book, receive);
      if (operation !== revision) return false;
      await audio.seek(position);
      if (operation !== revision) return false;
      audio.setRate(state.rate);
      ready = true;
      patch({ position, isLoading: false });
      if (autoPlay) audio.play();
      return true;
    } catch (error) {
      if (operation !== revision) return false;
      ready = false;
      audio.unload();
      patch({
        isLoading: false,
        isPlaying: false,
        isBuffering: false,
        error:
          progress?.getSnapshot().error ||
          (typeof (error as Error)?.message === "string"
            ? (error as Error).message
            : "Không thể mở chương sách. Vui lòng thử lại."),
      });
      return false;
    }
  };
  const seek = async (position: number) => {
    const chapter = active();
    if (!ready || !chapter || !Number.isFinite(position)) return;
    const operation = revision;
    const request = ++seekRevision;
    const target = Math.max(0, Math.min(position, chapter.duration));
    seeking = true;
    try {
      await audio.seek(target);
      if (operation !== revision || request !== seekRevision) return;
      patch({ position: target });
      checkpoint();
      void flushAll();
    } catch {
      if (operation === revision && request === seekRevision)
        patch({ notice: "Chưa thể tua audio. Vui lòng thử lại." });
    } finally {
      if (operation === revision && request === seekRevision) seeking = false;
    }
  };
  const play = async () => {
    if (!ready) return;
    if (state.position >= (active()?.duration ?? Infinity)) await seek(0);
    try {
      audio.play();
      patch({ notice: null });
    } catch {
      ready = false;
      patch({
        isPlaying: false,
        error: "Không thể bắt đầu phát. Vui lòng thử lại.",
      });
    }
  };
  const retry = async () => {
    if (!attempt) return;
    if (state.error) {
      const retry = attempt;
      await open(retry.bookId, retry.chapterId, retry.autoPlay, retry.hint);
    } else {
      checkpoint();
      await flushAll(true);
    }
  };
  const selectChapter = (id: string) => {
    const chapter = state.chapters.find((item) => item.id === id);
    if (chapter && !chapter.canPlay) {
      patch({ notice: "Mua sách để nghe tiếp chương này." });
      return Promise.resolve(false);
    }
    return state.book
      ? open(state.book.id, id, true, state.book)
      : Promise.resolve(false);
  };
  const move = (offset: number) => {
    const chapter = state.chapters[state.chapterIndex + offset];
    if (chapter && !chapter.canPlay) {
      patch({ notice: "Mua sách để nghe tiếp chương này." });
      return;
    }
    if (chapter) void selectChapter(chapter.id);
  };
  return {
    getSnapshot: () => state,
    getServerSnapshot: () => initial,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    open,
    close,
    pause,
    seek,
    selectChapter,
    retry,
    toggle: () => {
      if (state.error) void retry();
      else if (state.isPlaying) pause();
      else void play();
    },
    previous: () => move(-1),
    next: () => move(1),
    setRate: (rate: PlaybackRate) => {
      if (PLAYBACK_RATES.includes(rate)) {
        audio.setRate(rate);
        patch({ rate });
      }
    },
    setSleepTimer: (minutes: number | null) => {
      if (minutes === null) patch({ sleepEndsAt: null });
      else if (state.book && Number.isFinite(minutes) && minutes > 0)
        patch({ sleepEndsAt: now() + minutes * 60000 });
    },
    toggleBookmark: () => {
      if (state.book) patch({ bookmarked: !state.bookmarked });
    },
    clearNotice: () => patch({ notice: null }),
    flush: () => {
      checkpoint();
      return flushAll();
    },
    maintenance: () => {
      if (state.sleepEndsAt !== null && now() >= state.sleepEndsAt) {
        pause();
        patch({ sleepEndsAt: null, notice: "Đã dừng theo hẹn giờ của bạn." });
      }
      checkpoint();
      void flushAll();
    },
  };
}
