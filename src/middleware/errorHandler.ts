// backend/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.utils";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }

  console.error("Unexpected error:", err);
  return sendError(res, "Internal server error", 500);
};
