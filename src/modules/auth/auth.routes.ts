// backend/src/modules/auth/auth.routes.ts
import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  forgot,
  reset,
} from "./auth.controller";
import { validate } from "../../middleware/validate";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.schema";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/forgot-password", validate(forgotPasswordSchema), forgot);
router.post("/reset-password", validate(resetPasswordSchema), reset);

export default router;
    