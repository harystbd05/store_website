import { SortOrder } from "../utils/sort";

export class QueryCategoryDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  search?: string;

  constructor(query: Record<string, unknown>) {
    this.page = query.page ? Number(query.page) : undefined;
    this.limit = query.limit ? Number(query.limit) : undefined;

    this.sortBy = query.sortBy ? String(query.sortBy) : undefined;

    this.sortOrder =
      query.sortOrder === "asc" || query.sortOrder === "desc"
        ? (query.sortOrder as SortOrder)
        : undefined;

    this.search = query.search ? String(query.search) : undefined;
  }
}

export class CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;

  constructor(body: Record<string, unknown>) {
    this.name = String(body.name);
    this.slug = String(body.slug);

    if (body.description !== undefined) {
      this.description = String(body.description);
    }
  }
}

export class UpdateCategoryDto {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;

  constructor(body: Record<string, unknown>) {
    if (body.name !== undefined) {
      this.name = String(body.name);
    }
    if (body.slug !== undefined) {
      this.slug = String(body.slug);
    }
    if (body.description !== undefined) {
      this.description = String(body.description);
    }
    if (body.isActive !== undefined) {
      this.isActive = Boolean(body.isActive);
    }
  }
}
