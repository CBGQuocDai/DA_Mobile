import { ApiError } from "@/shared/errors/ApiError";
import type {
  FavoritesSnapshot,
  FavoriteBookState,
} from "@/shared/types/favorite.types";
import type { FavoritesRepository } from "./favorites.ports";

const emptyState = (): FavoriteBookState => ({
  isFavorite: null,
  isBusy: false,
  error: null,
});
const initial: FavoritesSnapshot = {
  sessionId: 0,
  userId: null,
  books: null,
  isLoading: false,
  error: null,
  states: {},
};

/** Shared session-scoped state, independent of React, navigation and native APIs. */
export function createBookFavorites(repository: FavoritesRepository) {
  let snapshot = initial;
  let session: { userId: string; token: string } | null = null;
  let revision = 0;
  let requestedList = false;
  let listRequest: { abort: AbortController; promise: Promise<void> } | null =
    null;
  const operations = new Map<
    string,
    { abort: AbortController; promise: Promise<void>; writes: boolean }
  >();
  const listeners = new Set<() => void>();
  const publish = (patch: Partial<FavoritesSnapshot>) => {
    snapshot = { ...snapshot, ...patch };
    listeners.forEach((listener) => listener());
  };
  const updateBook = (id: string, patch: Partial<FavoriteBookState>) =>
    publish({
      states: {
        ...snapshot.states,
        [id]: { ...(snapshot.states[id] ?? emptyState()), ...patch },
      },
    });
  const isCurrent = (version: number) =>
    revision === version && session !== null;
  const isUnauthorized = (error: unknown) =>
    error instanceof ApiError && (error.status === 401 || error.code === 4010);
  const stopList = () => {
    listRequest?.abort.abort();
    listRequest = null;
  };
  const finishList = (abort: AbortController, version: number) => {
    if (isCurrent(version) && listRequest?.abort === abort) {
      listRequest = null;
      publish({ isLoading: false });
    }
  };
  const applyStatus = (id: string, value: boolean) => {
    updateBook(id, { isFavorite: value, error: null });
    if (!value && snapshot.books)
      publish({
        books: snapshot.books.filter((book) => String(book.id) !== id),
      });
  };

  const load = (): Promise<void> => {
    if (!session) return Promise.resolve();
    requestedList = true;
    // A read started before a write must not restore a just-removed book.
    if ([...operations.values()].some((operation) => operation.writes))
      return Promise.resolve();
    if (listRequest) return listRequest.promise;
    const version = revision;
    const token = session.token;
    const abort = new AbortController();
    publish({ isLoading: true, error: null });
    const promise = (async () => {
      try {
        const books = await repository.list(token, abort.signal);
        if (!isCurrent(version) || abort.signal.aborted) return;
        const unique = Array.from(
          new Map(books.map((book) => [book.id, book])).values(),
        );
        const ids = new Set(unique.map((book) => String(book.id)));
        const states = { ...snapshot.states };
        for (const id of new Set([...Object.keys(states), ...ids])) {
          if (!operations.has(id))
            states[id] = {
              isFavorite: ids.has(id),
              isBusy: false,
              error: states[id]?.error ?? null,
            };
        }
        publish({ books: unique, states });
      } catch (error) {
        if (!isCurrent(version) || abort.signal.aborted) return;
        publish({
          error: isUnauthorized(error)
            ? "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
            : "Không thể tải sách yêu thích. Vui lòng thử lại.",
        });
      } finally {
        finishList(abort, version);
      }
    })();
    listRequest = { abort, promise };
    return promise;
  };

  const runBook = (
    id: string,
    writes: boolean,
    work: (
      token: string,
      signal: AbortSignal,
      version: number,
    ) => Promise<void>,
  ): Promise<void> => {
    if (!session || !/^[1-9]\d*$/.test(id)) return Promise.resolve();
    const running = operations.get(id);
    if (running) return running.promise;
    const version = revision;
    const token = session.token;
    const abort = new AbortController();
    if (writes) stopList();
    updateBook(id, { isBusy: true, error: null });
    const promise = (async () => {
      try {
        await work(token, abort.signal, version);
      } catch (error) {
        if (!isCurrent(version) || abort.signal.aborted) return;
        updateBook(id, {
          error: isUnauthorized(error)
            ? "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
            : "Không thể kiểm tra trạng thái yêu thích. Vui lòng thử lại.",
        });
      } finally {
        if (isCurrent(version) && operations.get(id)?.abort === abort) {
          operations.delete(id);
          updateBook(id, { isBusy: false });
          if (writes && requestedList) void load();
        }
      }
    })();
    operations.set(id, { abort, promise, writes });
    return promise;
  };

  const check = (id: string) =>
    runBook(id, false, async (token, signal, version) => {
      const value = await repository.check(id, token, signal);
      if (isCurrent(version) && !signal.aborted) {
        applyStatus(id, value);
        if (
          value &&
          snapshot.books &&
          !snapshot.books.some((book) => String(book.id) === id)
        )
          void load();
      }
    });

  const setFavorite = (id: string, desired: boolean) =>
    runBook(id, true, async (token, signal, version) => {
      // The caller expresses intent. A stale saved row must never re-add a book.
      const before = await repository.check(id, token, signal);
      if (!isCurrent(version) || signal.aborted) return;
      if (before === desired) {
        applyStatus(id, before);
        return;
      }
      try {
        const saved = await repository.toggle(id, token, signal);
        if (!isCurrent(version) || signal.aborted) return;
        applyStatus(id, saved);
        if (saved !== desired)
          updateBook(id, {
            error: "Trạng thái yêu thích đã thay đổi. Vui lòng thử lại.",
          });
      } catch (error) {
        if (!isCurrent(version) || signal.aborted) return;
        if (isUnauthorized(error)) throw error;
        // Never replay a toggle: an error can arrive after BE committed the write.
        try {
          const actual = await repository.check(id, token, signal);
          if (!isCurrent(version) || signal.aborted) return;
          applyStatus(id, actual);
          if (actual !== desired)
            updateBook(id, {
              error: "Chưa cập nhật được yêu thích. Vui lòng thử lại.",
            });
        } catch (checkError) {
          if (!isCurrent(version) || signal.aborted) return;
          if (isUnauthorized(checkError)) throw checkError;
          updateBook(id, {
            isFavorite: null,
            error:
              "Chưa xác nhận được trạng thái. Thử lại để kiểm tra trước khi cập nhật.",
          });
        }
      }
    });

  return {
    getSnapshot: () => snapshot,
    getServerSnapshot: () => initial,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setSession: (next: { userId: string; token: string } | null) => {
      if (session?.userId === next?.userId && session?.token === next?.token)
        return;
      revision += 1;
      stopList();
      operations.forEach(({ abort }) => abort.abort());
      operations.clear();
      session = next;
      requestedList = false;
      publish({
        ...initial,
        sessionId: revision,
        userId: next?.userId ?? null,
      });
    },
    load,
    check,
    setFavorite,
  };
}
