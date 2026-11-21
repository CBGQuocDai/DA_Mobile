import { ApiError } from '@/shared/errors/ApiError';
import { Platform } from 'react-native';
import type { ApiResponse } from '@/shared/types/api.types';
import type { BookOverviewResponse, BookProgress, CustomerChapter } from '@/shared/types/listening.types';
import type { PlaybackRepository } from '@/application/player/player.ports';
import { apiClient } from '../config/apiClient';
import { toApiError } from '../config/apiError';

async function request<T>(send: () => Promise<{ data: ApiResponse<T> }>): Promise<T> {
  try {
    const { data } = await send();
    if (data.code !== 2000) throw new ApiError(data.message || 'Không thể tải dữ liệu nghe sách.', undefined, data.code);
    return data.data;
  } catch (error) { throw toApiError(error); }
}
const headersFor = (token: string | null) => ({ Authorization: token ? `Bearer ${token}` : '' });
const assertBookId = (id: string) => {
  if (!/^[1-9]\d*$/.test(id)) throw new ApiError('Đây là sách minh họa. Hãy chọn sách từ trang chủ để nghe.');
};
function validateProgress(progress: BookProgress, bookId: string) {
  if (progress?.bookId !== Number(bookId) || !Array.isArray(progress.chapters)
    || progress.chapters.some((c) => !Number.isInteger(c.chapterId) || !Number.isInteger(c.lastPlayAt) || c.lastPlayAt < 0)
    || (progress.resume != null && (!Number.isInteger(progress.resume.chapterId) || !Number.isInteger(progress.resume.lastPlayAt)))) {
    throw new ApiError('Tiến trình nghe trả về không hợp lệ. Vui lòng thử lại.');
  }
  return progress;
}

/** Capture the session token: a late write must never use a newly signed-in account. */
export const playbackService: PlaybackRepository = {
  async getDetails(bookId, token, signal) {
    assertBookId(bookId);
    const config = { signal, headers: headersFor(token) };
    const [overview, chapters, ownership] = await Promise.all([
      request<BookOverviewResponse>(() => apiClient.get(`/books/${bookId}/overview`, config)),
      request<CustomerChapter[]>(() => apiClient.get(`/books/${bookId}/chapters/list`, config)),
      token ? request<{ purchased: boolean }>(() => apiClient.get(`/customer/books/${bookId}/check`, config)) : null,
    ]);
    if (String(overview?.book?.id) !== bookId || !Array.isArray(chapters)
      || chapters.some((c) => !Number.isInteger(c.id) || c.id < 1 || !Number.isInteger(c.chapterOrder))
      || (token && typeof ownership?.purchased !== 'boolean')) throw new ApiError('Không thể tải thông tin chương sách.');
    return { overview, chapters, purchased: ownership?.purchased ?? false };
  },
  progress(bookId, token) {
    assertBookId(bookId);
    const config = { headers: headersFor(token) };
    return {
      load: async () => validateProgress(await request<BookProgress>(() => apiClient.get(`/customer/books/${bookId}/progress`, config)), bookId),
      save: async (chapterId, body) => validateProgress(await request<BookProgress>(() => apiClient.put(
        `/customer/books/${bookId}/chapters/${chapterId}/progress`, body,
        Platform.OS === 'web' ? { ...config, adapter: 'fetch', fetchOptions: { keepalive: true } } : config)), bookId),
    };
  },
};
