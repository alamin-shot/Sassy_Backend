// backend/src/modules/uploads/uploads.service.ts
import { AppError } from "../../middleware/errorHandler";

export const processUpload = (file: Express.Multer.File | undefined) => {
  if (!file) {
    throw new AppError("No file uploaded", 400);
  }
  const url = `/uploads/projects/${file.filename}`;
  return { url };
};
