// backend/src/utils/response.utils.ts
import { Response } from "express";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
  pagination?: ApiResponse<T>["pagination"],
) => {
  const body: ApiResponse<T> = { success: true, data, message };
  if (pagination) body.pagination = pagination;
  return res.status(statusCode).json(body);
};

export const sendError = (res: Response, message: string, statusCode = 500) => {
  return res.status(statusCode).json({ success: false, message });
};
