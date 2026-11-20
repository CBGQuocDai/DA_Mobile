const TOKEN_KEY = 'da_mobile_access_token';

export const tokenStorage = {
  async getToken(): Promise<string | null> {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(TOKEN_KEY);
  },
  async setToken(token: string): Promise<void> { window.localStorage.setItem(TOKEN_KEY, token); },
  async clearToken(): Promise<void> {
    if (typeof window !== 'undefined') window.localStorage.removeItem(TOKEN_KEY);
  },
};
