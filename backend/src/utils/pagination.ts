export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export class PaginationUtil {
  static getPagination(query: PaginationQuery) {
    const page = Number(query.page) > 0 ? Number(query.page) : 1;
    const limit = Number(query.limit) > 0 ? Number(query.limit) : 12;
    const skip = (page - 1) * limit;
    return { page, limit, skip };
  }
}
