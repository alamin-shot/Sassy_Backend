// backend/src/modules/uploads/uploads.controller.ts
import { Request, Response, NextFunction } from "express";
import { processUpload } from "./uploads.service";
import { sendSuccess } from "../../utils/response.utils";

export const uploadProjectImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = processUpload(req.file);
    sendSuccess(res, result, "Image uploaded", 201);
  } catch (err) {
    next(err);
  }
};
