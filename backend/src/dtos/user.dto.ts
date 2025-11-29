import { SortOrder } from "../utils/sort";

export class QueryUserDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  search?: string;
  role?: "admin" | "seller" | "customer";

  constructor(query: Record<string, unknown>) {
    this.page = query.page ? Number(query.page) : undefined;
    this.limit = query.limit ? Number(query.limit) : undefined;
    this.sortBy = query.sortBy ? String(query.sortBy) : undefined;

    this.sortOrder =
      query.sortOrder === "asc" || query.sortOrder === "desc"
        ? (query.sortOrder as SortOrder)
        : undefined;

    this.search = query.search ? String(query.search) : undefined;

    this.role =
      query.role && ["admin", "seller", "customer"].includes(String(query.role))
        ? (String(query.role) as "admin" | "seller" | "customer")
        : undefined;
  }
}

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  phone?: string;

  constructor(body: Record<string, unknown>) {
    this.name = String(body.name);
    this.email = String(body.email);
    this.password = String(body.password);

    if (body.phone !== undefined) {
      this.phone = String(body.phone);
    }
  }
}

export class UpdateUserDto {
  name?: string;
  phone?: string;
  role?: "admin" | "seller" | "customer";
  isActive?: boolean;

  constructor(body: Record<string, unknown>) {
    if (body.name !== undefined) {
      this.name = String(body.name);
    }

    if (body.phone !== undefined) {
      this.phone = String(body.phone);
    }

    if (
      body.role !== undefined &&
      ["admin", "seller", "customer"].includes(String(body.role))
    ) {
      this.role = String(body.role) as "admin" | "seller" | "customer";
    }

    if (body.isActive !== undefined) {
      this.isActive = Boolean(body.isActive);
    }
  }
}
