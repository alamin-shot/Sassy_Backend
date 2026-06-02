// backend/src/types/api.types.ts
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
