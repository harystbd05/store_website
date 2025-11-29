export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: PaginationMeta;

  constructor(data: T, message?: string, pagination?: PaginationMeta) {
    this.success = true;
    this.data = data;
    this.message = message;
    this.pagination = pagination;
  }
}
