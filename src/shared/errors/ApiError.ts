export class ApiError extends Error {
  constructor(message: string, readonly status?: number, readonly code?: number) {
    super(message);
    this.name = 'ApiError';
  }
}
