// backend/src/utils/pagination.utils.ts
import type { PaginationMeta } from "../types/api.types";

export interface PaginationParams {
  page: number;
  limit: number;
}

export const getPaginationMeta = (
  total: number,
  page: number,
  limit: number,
): PaginationMeta => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const getPaginationParams = (
  page?: string | number,
  limit?: string | number,
): PaginationParams => {
  const parsedPage = Math.max(1, parseInt(page as string) || 1);
  const parsedLimit = Math.min(
    100,
    Math.max(1, parseInt(limit as string) || 10),
  );
  return { page: parsedPage, limit: parsedLimit };
};
