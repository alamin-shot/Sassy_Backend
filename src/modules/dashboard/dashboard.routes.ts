// backend/src/modules/dashboard/dashboard.routes.ts
import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import {
  getDashboardStats,
  getDashboardActivity,
  getDashboardTasks,
} from "./dashboard.controller";

const router = Router();
router.use(authenticate);

router.get("/stats", getDashboardStats);
router.get("/activity", getDashboardActivity);
router.get("/tasks", getDashboardTasks);

export default router;
