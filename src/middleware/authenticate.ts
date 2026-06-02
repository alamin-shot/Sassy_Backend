// backend/src/middleware/authenticate.ts
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.utils";
import { AppError } from "./errorHandler";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.access_token;
  if (!token) {
    throw new AppError("Authentication required", 401);
  }

  try {
    const decoded = verifyAccessToken(token);
    const role = decoded.role as "user" | "admin" | "superadmin";
    req.user = { userId: decoded.userId, role };
    next();
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }
};
