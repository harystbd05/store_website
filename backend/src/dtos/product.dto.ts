import { SortOrder } from "../utils/sort";

export class QueryProductDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  search?: string;
  platform?: string;
  categoryId?: string;
  sellerId?: string;

  constructor(query: Record<string, unknown>) {
    this.page = query.page ? Number(query.page) : undefined;
    this.limit = query.limit ? Number(query.limit) : undefined;

    this.sortBy = query.sortBy ? String(query.sortBy) : undefined;

    this.sortOrder =
      query.sortOrder === "asc" || query.sortOrder === "desc"
        ? (query.sortOrder as SortOrder)
        : undefined;

    this.search = query.search ? String(query.search) : undefined;
    this.platform = query.platform ? String(query.platform) : undefined;
    this.categoryId = query.categoryId ? String(query.categoryId) : undefined;
    this.sellerId = query.sellerId ? String(query.sellerId) : undefined;
  }
}

export class CreateProductDto {
  categoryId: string;
  sellerId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  platform: string;
  imageUrl?: string;
  stock: number;

  constructor(body: Record<string, unknown>) {
    this.categoryId = String(body.categoryId);
    this.sellerId = String(body.sellerId);
    this.name = String(body.name);
    this.slug = String(body.slug);
    this.description = String(body.description);
    this.price = Number(body.price);
    this.currency = String(body.currency ?? "IDR");
    this.platform = String(body.platform);
    this.stock = Number(body.stock ?? 0);

    if (body.imageUrl !== undefined) {
      this.imageUrl = String(body.imageUrl);
    }
  }
}

export class UpdateProductDto {
  categoryId?: string;
  sellerId?: string;
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  currency?: string;
  platform?: string;
  imageUrl?: string;
  stock?: number;
  isActive?: boolean;

  constructor(body: Record<string, unknown>) {
    if (body.categoryId !== undefined)
      this.categoryId = String(body.categoryId);
    if (body.sellerId !== undefined) this.sellerId = String(body.sellerId);
    if (body.name !== undefined) this.name = String(body.name);
    if (body.slug !== undefined) this.slug = String(body.slug);
    if (body.description !== undefined)
      this.description = String(body.description);
    if (body.price !== undefined) this.price = Number(body.price);
    if (body.currency !== undefined) this.currency = String(body.currency);
    if (body.platform !== undefined) this.platform = String(body.platform);
    if (body.imageUrl !== undefined) this.imageUrl = String(body.imageUrl);
    if (body.stock !== undefined) this.stock = Number(body.stock);
    if (body.isActive !== undefined) this.isActive = Boolean(body.isActive);
  }
}
