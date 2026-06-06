// backend/src/modules/uploads/uploads.routes.ts
import { Router } from "express";
import { uploadProjectImage } from "./uploads.controller";
import { uploadSingle } from "../../middleware/upload";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

router.post(
  "/uploads/project-image",
  authenticate,
  uploadSingle,
  uploadProjectImage,
);

export default router;
