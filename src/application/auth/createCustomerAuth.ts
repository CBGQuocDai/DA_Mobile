import { ApiError } from '@/shared/errors/ApiError';
import type { AuthSnapshot, LoginRequest, RegisterRequest } from '@/shared/types/auth.types';
import type { AuthRepository, TokenStorage } from './customerAuth.ports';

export class AuthCancelledError extends Error {
  constructor() { super('Yêu cầu đăng nhập đã được hủy.'); this.name = 'AuthCancelledError'; }
}
export class RegistrationCompleteError extends Error {
  constructor() { super('Đăng ký thành công. Vui lòng đăng nhập bằng tài khoản vừa tạo.'); this.name = 'RegistrationCompleteError'; }
}

/** Session use cases depend on ports, never React, Axios, navigation or native storage. */
export function createCustomerAuth(repository: AuthRepository, storage: TokenStorage) {
  const initial: AuthSnapshot = { isReady: false, user: null, error: null };
  let snapshot = initial;
  let token: string | null = null;
  let revision = 0;
  let restoring: Promise<void> | null = null;
  let writes = Promise.resolve();
  const listeners = new Set<() => void>();
  const publish = (next: AuthSnapshot) => { snapshot = next; listeners.forEach((listener) => listener()); };
  const assertCurrent = (operation: number, signal?: AbortSignal) => {
    if (revision !== operation || signal?.aborted) throw new AuthCancelledError();
  };
  // Serialize secure-storage writes so a late login cannot restore a logged-out token.
  const persist = (operation: number, next: string | null, signal?: AbortSignal, commit?: () => void) => {
    const pending = writes.then(async () => {
      // Clears must still run if a newer login has merely started (and might fail).
      // A newer successful login writes its token later in this same queue.
      if (next !== null) assertCurrent(operation, signal);
      if (next) await storage.setToken(next);
      else await storage.clearToken();
      if (next !== null) {
        try { assertCurrent(operation, signal); }
        catch (error) {
          // Roll back inside the queue, before any newer login writes its token.
          if (token) await storage.setToken(token);
          else await storage.clearToken();
          throw error;
        }
      }
      commit?.();
    });
    writes = pending.catch(() => undefined);
    return pending;
  };
  const clearSession = () => {
    const operation = ++revision;
    token = null;
    publish({ isReady: true, user: null, error: null });
    return persist(operation, null).catch((error) => {
      if (revision !== operation) return;
      publish({ isReady: true, user: null, error: 'Không thể xóa phiên đã lưu. Vui lòng thử đăng xuất lại.' });
      throw error;
    });
  };

  const restore = (): Promise<void> => {
    if (restoring) return restoring;
    const operation = ++revision;
    const pending = (async () => {
      try {
        await writes;
        const saved = await storage.getToken();
        assertCurrent(operation);
        token = saved;
        const user = saved ? await repository.getProfile(saved) : null;
        assertCurrent(operation);
        publish({ isReady: true, user, error: null });
      } catch (error) {
        if (operation !== revision) return;
        if (error instanceof ApiError && error.status === 401) {
          await clearSession().catch(() => undefined);
        } else {
          publish({ isReady: true, user: snapshot.user, error: 'Không thể tải phiên đăng nhập. Vui lòng thử lại.' });
        }
      }
    })();
    restoring = pending.finally(() => { restoring = null; });
    return restoring;
  };

  const authenticate = async (data: LoginRequest, operation: number, signal?: AbortSignal) => {
    const nextToken = await repository.login({ email: data.email.trim(), password: data.password }, signal);
    assertCurrent(operation, signal);
    const user = await repository.getProfile(nextToken, signal);
    assertCurrent(operation, signal);
    try {
      await persist(operation, nextToken, signal, () => {
        token = nextToken;
        publish({ isReady: true, user, error: null });
      });
    }
    catch (error) {
      if (error instanceof AuthCancelledError) throw error;
      throw new Error('Không thể lưu phiên đăng nhập. Vui lòng thử lại.');
    }
    return user;
  };

  return {
    getSnapshot: () => snapshot,
    getServerSnapshot: () => initial,
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    getAccessToken: () => token,
    initialize: () => snapshot.isReady ? Promise.resolve() : restore(),
    restoreSession: restore,
    login: (data: LoginRequest, signal?: AbortSignal) => authenticate(data, ++revision, signal),
    register: async (data: RegisterRequest, signal?: AbortSignal) => {
      const operation = ++revision;
      await repository.register({ ...data, email: data.email.trim(), fullName: data.fullName.trim() }, signal);
      assertCurrent(operation, signal);
      try { return await authenticate(data, operation, signal); }
      catch (error) {
        assertCurrent(operation, signal);
        if (error instanceof AuthCancelledError) throw error;
        throw new RegistrationCompleteError();
      }
    },
    expireSession: (expiredToken: string) => {
      if (token === expiredToken) void clearSession().catch(() => undefined);
    },
    logout: async () => {
      const previous = token;
      const clearing = clearSession();
      // Always revoke the captured token, even if another session starts meanwhile.
      const revoke = previous ? repository.logout(previous).catch(() => undefined) : Promise.resolve();
      await clearing;
      await revoke;
    },
  };
}
