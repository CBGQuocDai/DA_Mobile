export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  total: number;
  totalPage: number;
  page: number;
  pageSize: number;
}
