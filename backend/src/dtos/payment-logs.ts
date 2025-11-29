import { SortOrder } from "../utils/sort";

export class QueryPaymentLogDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  paymentStatus?: string;
  paymentMethod?: string;
  userId?: string;

  constructor(query: Record<string, unknown>) {
    this.page = query.page ? Number(query.page) : undefined;
    this.limit = query.limit ? Number(query.limit) : undefined;

    this.sortBy = query.sortBy ? String(query.sortBy) : undefined;
    this.sortOrder =
      query.sortOrder === "asc" || query.sortOrder === "desc"
        ? (query.sortOrder as SortOrder)
        : undefined;

    if (query.paymentStatus) this.paymentStatus = String(query.paymentStatus);
    if (query.paymentMethod) this.paymentMethod = String(query.paymentMethod);
    if (query.userId) this.userId = String(query.userId);
  }
}

export class CreatePaymentLogDto {
  userId: string;
  totalAmount: number;
  currency: string;
  paymentStatus: string;
  paymentMethod: string;
  invoiceCode: string;

  constructor(body: Record<string, unknown>) {
    this.userId = String(body.userId);
    this.totalAmount = Number(body.totalAmount);
    this.currency = String(body.currency ?? "IDR");
    this.paymentStatus = String(body.paymentStatus);
    this.paymentMethod = String(body.paymentMethod);
    this.invoiceCode = String(body.invoiceCode);
  }
}
