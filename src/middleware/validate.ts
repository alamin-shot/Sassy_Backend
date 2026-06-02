// backend/src/middleware/validate.ts
import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "./errorHandler";

export const validate = (schema: z.ZodType) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      throw new AppError(`Validation failed: ${messages}`, 400);
    }
    req.body = result.data;
    next();
  };
};
