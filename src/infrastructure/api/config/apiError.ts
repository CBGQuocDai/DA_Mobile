import axios from 'axios';
import { ApiError } from '@/shared/errors/ApiError';

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (axios.isAxiosError(error)) {
    if (!error.response) return new ApiError(error.code === 'ECONNABORTED'
      ? 'Máy chủ phản hồi quá lâu. Vui lòng thử lại.'
      : 'Không thể kết nối đến máy chủ. Vui lòng thử lại.');
    const body = error.response.data;
    return new ApiError(typeof body?.message === 'string' ? body.message : 'Yêu cầu không thành công. Vui lòng thử lại.',
      error.response.status, typeof body?.code === 'number' ? body.code : undefined);
  }
  return new ApiError('Không thể hoàn tất yêu cầu. Vui lòng thử lại.');
}
