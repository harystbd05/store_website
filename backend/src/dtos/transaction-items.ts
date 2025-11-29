import { SortOrder } from "../utils/sort";

export class QueryTransactionItemDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  transactionId?: string;
  productId?: string;

  constructor(query: Record<string, unknown>) {
    this.page = query.page ? Number(query.page) : undefined;
    this.limit = query.limit ? Number(query.limit) : undefined;

    this.sortBy = query.sortBy ? String(query.sortBy) : undefined;

    this.sortOrder =
      query.sortOrder === "asc" || query.sortOrder === "desc"
        ? (query.sortOrder as SortOrder)
        : undefined;

    if (query.transactionId) {
      this.transactionId = String(query.transactionId);
    }

    if (query.productId) {
      this.productId = String(query.productId);
    }
  }
}

export class CreateTransactionItemDto {
  transactionId: string;
  productId: string;
  quantity: number;
  price: number;
  subTotal: number;

  constructor(body: Record<string, unknown>) {
    this.transactionId = String(body.transactionId);
    this.productId = String(body.productId);
    this.quantity = Number(body.quantity);
    this.price = Number(body.price);
    this.subTotal = Number(body.subTotal);
  }
}
