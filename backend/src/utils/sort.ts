export type SortOrder = "asc" | "desc";

export interface SortQuery {
  sortBy?: string;
  sortOrder?: SortOrder;
}

export class SortUtil {
  static getSort(query: SortQuery): Record<string, 1 | -1> {
    const sortBy = query.sortBy || "createdAt";
    const sortOrder: 1 | -1 = query.sortOrder === "asc" ? 1 : -1;
    return { [sortBy]: sortOrder };
  }
}
