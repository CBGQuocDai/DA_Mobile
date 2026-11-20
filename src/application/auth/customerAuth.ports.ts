import type { CustomerUser, LoginRequest, RegisterRequest } from '@/shared/types/auth.types';

export interface AuthRepository {
  login(data: LoginRequest, signal?: AbortSignal): Promise<string>;
  register(data: RegisterRequest, signal?: AbortSignal): Promise<void>;
  getProfile(token: string, signal?: AbortSignal): Promise<CustomerUser>;
  logout(token: string): Promise<void>;
}

export interface TokenStorage {
  getToken(): Promise<string | null>;
  setToken(token: string): Promise<void>;
  clearToken(): Promise<void>;
}
