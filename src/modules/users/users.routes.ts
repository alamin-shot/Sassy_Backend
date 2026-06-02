// backend/src/modules/users/users.routes.ts
import { Router } from "express";
import { getMe, updateMe, updatePassword } from "./users.controller";
import { authenticate } from "../../middleware/authenticate";

const router = Router();
router.use(authenticate);
router.get("/me", getMe);
router.patch("/me", updateMe);
router.patch("/me/password", updatePassword);

export default router;
