import type { ApiResponse } from '@/shared/types/api.types';
import type { CatalogCategory } from '@/shared/types/catalog.types';
import { apiClient } from '../config/apiClient';

export const categoryService = {
  async getCategories(signal?: AbortSignal): Promise<CatalogCategory[]> {
    const { data } = await apiClient.get<ApiResponse<CatalogCategory[]>>('/categories', { signal });
    if (data.code !== 2000 || !Array.isArray(data.data)
      || data.data.some((category) => !Number.isInteger(category?.id) || category.id < 1
        || typeof category.name !== 'string' || !category.name.trim())) {
      throw new Error('Không thể tải thể loại sách');
    }
    return data.data;
  },
};
