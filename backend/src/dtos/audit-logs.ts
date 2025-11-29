import { SortOrder } from "../utils/sort";

export class QueryAuditLogDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  search?: string;
  userId?: string;

  constructor(query: Record<string, unknown>) {
    this.page = query.page ? Number(query.page) : undefined;
    this.limit = query.limit ? Number(query.limit) : undefined;

    this.sortBy = query.sortBy ? String(query.sortBy) : undefined;

    this.sortOrder =
      query.sortOrder === "asc" || query.sortOrder === "desc"
        ? (query.sortOrder as SortOrder)
        : undefined;

    this.search = query.search ? String(query.search) : undefined;

    if (query.userId) {
      this.userId = String(query.userId);
    }
  }
}

export class CreateAuditLogDto {
  userId: string;
  action: string;
  description?: string;
  ipAddress?: string;

  constructor(body: Record<string, unknown>) {
    this.userId = String(body.userId);
    this.action = String(body.action);

    if (body.description !== undefined) {
      this.description = String(body.description);
    }

    if (body.ipAddress !== undefined) {
      this.ipAddress = String(body.ipAddress);
    }
  }
}
