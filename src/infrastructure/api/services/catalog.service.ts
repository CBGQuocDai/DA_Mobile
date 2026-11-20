import type { ApiResponse, PageResponse } from '@/shared/types/api.types';
import type { CatalogBook, CatalogParams } from '@/shared/types/catalog.types';
import { apiClient } from '../config/apiClient';

export const catalogService = {
  /** Same public endpoint as FE's customerBookService.getBooks. */
  async getBooks(params: CatalogParams, signal?: AbortSignal): Promise<PageResponse<CatalogBook>> {
    const { data: response } = await apiClient.get<ApiResponse<PageResponse<CatalogBook>>>('/books/catalog', { params, signal });
    if (response.code !== 2000 || !Array.isArray(response.data?.content)) {
      throw new Error('Không thể tải danh sách sách');
    }
    return response.data;
  },
};
