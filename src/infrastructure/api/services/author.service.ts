import type { ApiResponse, PageResponse } from "@/shared/types/api.types";
import type { CatalogAuthor } from "@/shared/types/catalog.types";
import { apiClient } from "../config/apiClient";

export const authorService = {
  async searchAuthors(
    params: { keyword?: string; page: number; size: number },
    signal?: AbortSignal,
  ): Promise<PageResponse<CatalogAuthor>> {
    const { data: response } = await apiClient.get<
      ApiResponse<PageResponse<CatalogAuthor>>
    >("/authors/search", { params, signal });
    const page = response.data;
    if (
      response.code !== 2000 ||
      !Array.isArray(page?.content) ||
      !Number.isInteger(page.total) ||
      page.total < 0 ||
      !Number.isInteger(page.totalPage) ||
      page.totalPage < 0 ||
      !Number.isInteger(page.page) ||
      page.page < 0 ||
      !Number.isInteger(page.pageSize) ||
      page.pageSize < 1 ||
      page.content.some(
        (author) =>
          !Number.isInteger(author?.id) ||
          author.id < 1 ||
          typeof author.fullName !== "string" ||
          !author.fullName.trim(),
      )
    ) {
      throw new Error("Không thể tải danh sách tác giả");
    }
    return page;
  },
};
