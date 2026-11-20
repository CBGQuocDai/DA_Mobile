import type { ApiResponse } from '@/shared/types/api.types';
import type { CustomerProfileResponse, CustomerUser, LoginRequest, RegisterRequest } from '@/shared/types/auth.types';
import { ApiError } from '@/shared/errors/ApiError';
import { apiClient } from '../config/apiClient';
import { toApiError } from '../config/apiError';

async function request<T>(send: () => Promise<{ data: ApiResponse<T> }>): Promise<T> {
  try {
    const { data } = await send();
    if (data.code !== 2000) throw new ApiError(data.message || 'Yêu cầu không thành công.', undefined, data.code);
    return data.data;
  } catch (error) { throw toApiError(error); }
}

export const authService = {
  async login(credentials: LoginRequest, signal?: AbortSignal): Promise<string> {
    const data = await request<{ accessToken: string }>(() => apiClient.post('/customer/login', credentials, { signal }));
    if (typeof data?.accessToken !== 'string' || !data.accessToken.trim()) throw new ApiError('Máy chủ chưa trả về phiên đăng nhập hợp lệ.');
    return data.accessToken;
  },
  async register({ email, password, fullName }: RegisterRequest, signal?: AbortSignal): Promise<void> {
    await request(() => apiClient.post('/customer/register', { email, password, fullname: fullName }, { signal }));
  },
  async getProfile(token: string, signal?: AbortSignal): Promise<CustomerUser> {
    const data = await request<CustomerProfileResponse>(() => apiClient.get('/customer/profile', {
      signal, headers: { Authorization: `Bearer ${token}` },
    }));
    if (data?.id == null) throw new ApiError('Không thể tải thông tin tài khoản. Vui lòng thử lại.');
    return { id: String(data.id), email: data.email ?? '', fullName: data.fullName?.trim() || 'Bạn đọc', avatarUrl: data.avatarUrl || undefined };
  },
  async logout(token: string): Promise<void> {
    await request(() => apiClient.post('/auth/logout', null, { headers: { Authorization: `Bearer ${token}` } }));
  },
};
