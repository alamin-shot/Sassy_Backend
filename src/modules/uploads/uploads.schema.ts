// backend/src/modules/uploads/uploads.schema.ts
import { z } from "zod";

export const uploadImageSchema = z.object({
  image: z.any().optional(),
});

export type UploadImageInput = z.infer<typeof uploadImageSchema>;
