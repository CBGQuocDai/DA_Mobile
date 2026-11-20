export interface LoginRequest { email: string; password: string }
export interface RegisterRequest extends LoginRequest { fullName: string }
export interface CustomerUser { id: string; email: string; fullName: string; avatarUrl?: string }
export interface AuthSnapshot { isReady: boolean; user: CustomerUser | null; error: string | null }

export interface CustomerProfileResponse {
  id: number;
  email?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
}
