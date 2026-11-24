import type { FavoritesRepository } from "@/application/favorites/favorites.ports";
import type { ApiResponse } from "@/shared/types/api.types";
import type { CatalogBook } from "@/shared/types/catalog.types";
import { apiClient } from "../config/apiClient";
import { toApiError } from "../config/apiError";

const headers = (token: string) => ({ Authorization: `Bearer ${token}` });
const validId = (id: string) => {
  if (!/^[1-9]\d*$/.test(id)) throw new Error("ID sách không hợp lệ");
};

export const bookFavoriteService: FavoritesRepository = {
  async list(token, signal) {
    try {
      const { data } = await apiClient.get<ApiResponse<CatalogBook[]>>(
        "/book-favorite",
        { headers: headers(token), signal },
      );
      if (
        data.code !== 2000 ||
        !Array.isArray(data.data) ||
        data.data.some(
          (book) =>
            !Number.isInteger(book?.id) ||
            book.id < 1 ||
            typeof book.title !== "string" ||
            !book.title.trim() ||
            !["PUBLISHED", "UNPUBLISHED", "PROCESSING", "FAILED"].includes(
              book.status,
            ),
        )
      )
        throw new Error("Response sách yêu thích không hợp lệ");
      return data.data;
    } catch (error) {
      throw toApiError(error);
    }
  },
  async check(bookId, token, signal) {
    validId(bookId);
    try {
      const { data } = await apiClient.get<ApiResponse<boolean>>(
        `/book-favorite/${bookId}/check`,
        { headers: headers(token), signal },
      );
      if (data.code !== 2000 || typeof data.data !== "boolean")
        throw new Error("Response trạng thái yêu thích không hợp lệ");
      return data.data;
    } catch (error) {
      throw toApiError(error);
    }
  },
  async toggle(bookId, token, signal) {
    validId(bookId);
    try {
      const { data } = await apiClient.post<
        ApiResponse<{ bookId: number; isFavorite: boolean }>
      >(`/book-favorite/${bookId}/toggle`, undefined, {
        headers: headers(token),
        signal,
      });
      if (
        data.code !== 2000 ||
        data.data?.bookId !== Number(bookId) ||
        typeof data.data?.isFavorite !== "boolean"
      )
        throw new Error("Response cập nhật yêu thích không hợp lệ");
      return data.data.isFavorite;
    } catch (error) {
      throw toApiError(error);
    }
  },
};
