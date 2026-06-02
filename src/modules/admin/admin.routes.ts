// backend/src/modules/admin/admin.routes.ts
import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { stats, users, updateUser, projects } from "./admin.controller";

const router = Router();
router.use(authenticate);
router.use(authorize("admin", "superadmin"));

router.get("/stats", stats);
router.get("/users", users);
router.patch("/users/:id", updateUser);
router.get("/projects", projects);

export default router;
