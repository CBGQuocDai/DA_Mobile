import type { BookProgress, ChapterProgress } from '@/shared/types/listening.types';
import type { ProgressTransport } from './player.ports';

const statusOf = (error: unknown) => (error as { status?: number })?.status;
const messageFor = (error: unknown, reading: boolean) => statusOf(error) === 401
  ? 'Phiên đăng nhập hết hạn. Đăng nhập lại để lưu tiến trình.'
  : reading ? 'Không thể tải tiến trình nghe. Thử lại để khôi phục vị trí.'
    : 'Chưa lưu được tiến trình nghe. Vui lòng thử lại.';

/** One serialized queue per captured account/book; later rewinds supersede earlier writes. */
export function createListeningProgress(transport: ProgressTransport) {
  let state = { progress: null as BookProgress | null, isSaving: false, error: null as string | null };
  let loading: Promise<BookProgress> | null = null;
  let saving: Promise<void> | null = null;
  let revision = 0;
  let automaticRetry = true;
  const pending = new Map<number, ChapterProgress>();
  const dirty = new Map<number, ChapterProgress>();
  const listeners = new Set<() => void>();
  const publish = (patch: Partial<typeof state>) => {
    state = { ...state, ...patch };
    listeners.forEach((listener) => listener());
  };
  const merge = (server: BookProgress) => {
    const chapters = new Map(server.chapters.map((chapter) => [chapter.chapterId, chapter]));
    dirty.forEach((chapter, id) => chapters.set(id, chapter));
    return { ...server, chapters: [...chapters.values()].sort((a, b) => a.chapterIndex - b.chapterIndex) };
  };
  const load = (refresh = false): Promise<BookProgress> => {
    if (loading) return loading;
    if (state.progress && !refresh) return Promise.resolve(state.progress);
    const startedAt = revision;
    loading = transport.load().then((progress) => {
      if (revision === startedAt || !state.progress) publish({ progress: merge(progress) });
      if (!pending.size) publish({ error: null });
      return state.progress!;
    }).catch((error) => {
      publish({ error: messageFor(error, true) });
      throw error;
    }).finally(() => { loading = null; });
    return loading;
  };
  const flush = (manual = false): Promise<void> => {
    if (saving) return saving;
    if (!pending.size || (!automaticRetry && !manual)) return Promise.resolve();
    publish({ isSaving: true });
    saving = (async () => {
      while (pending.size) {
        const chapter = pending.values().next().value!;
        pending.delete(chapter.chapterId);
        try {
          const result = await transport.save(chapter.chapterId, { lastPlayAt: chapter.lastPlayAt, isComplete: chapter.isComplete });
          revision++;
          automaticRetry = true;
          if (dirty.get(chapter.chapterId) === chapter) dirty.delete(chapter.chapterId);
          publish({ progress: merge(result), error: null });
        } catch (error) {
          const status = statusOf(error);
          const retryable = !status || status >= 500 || status === 429 || status === 401;
          if (retryable && !pending.has(chapter.chapterId)) {
            const newer = [...pending];
            pending.clear();
            pending.set(chapter.chapterId, chapter);
            newer.forEach(([id, value]) => pending.set(id, value));
          } else if (!retryable && dirty.get(chapter.chapterId) === chapter) dirty.delete(chapter.chapterId);
          automaticRetry = status !== 401;
          publish({ error: messageFor(error, false) });
          break;
        }
      }
    })().finally(() => { saving = null; publish({ isSaving: false }); });
    return saving;
  };
  return {
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    getSnapshot: () => state,
    hasPending: () => pending.size > 0 || saving !== null,
    load, flush,
    prepareResume: async () => {
      const existing = state.progress !== null;
      await load();
      await flush(true);
      if (pending.size) throw new Error(state.error || 'Chưa lưu được tiến trình đang chờ.');
      return existing ? load(true) : state.progress!;
    },
    checkpoint: (chapterId: number, chapterIndex: number, position: number, complete = false) => {
      if (!state.progress || !Number.isFinite(position) || position < 0) return;
      const previous = state.progress.chapters.find((chapter) => chapter.chapterId === chapterId);
      const lastPlayAt = Math.floor(position);
      const isComplete = complete || Boolean(previous?.isComplete);
      if (previous?.lastPlayAt === lastPlayAt && previous.isComplete === isComplete) return;
      const chapter = { chapterId, chapterIndex, lastPlayAt, isComplete, updatedAt: new Date().toISOString() };
      dirty.set(chapterId, chapter);
      pending.delete(chapterId);
      pending.set(chapterId, chapter);
      publish({ progress: merge(state.progress) });
    },
  };
}
