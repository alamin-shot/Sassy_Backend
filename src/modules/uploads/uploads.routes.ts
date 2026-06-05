import { Router } from "express";
import { uploadProjectImage } from "./uploads.controller";
import { uploadSingle } from "../../middleware/upload";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

// Protected route - only authenticated users can upload
router.post(
  "/upload/project-image",
  authenticate,
  uploadSingle,
  uploadProjectImage,
);

export default router;
