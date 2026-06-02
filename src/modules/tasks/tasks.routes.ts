// backend/src/modules/tasks/tasks.routes.ts
import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import {
  createTaskSchema,
  updateTaskSchema,
  reorderTasksSchema,
} from "./tasks.schema";
import { create, list, update, remove, reorder } from "./tasks.controller";

const router = Router({ mergeParams: true }); // to access :projectId
router.use(authenticate);

router.post("/", validate(createTaskSchema), create);
router.get("/", list);
router.patch("/reorder", validate(reorderTasksSchema), reorder);
router.patch("/:id", validate(updateTaskSchema), update);
router.delete("/:id", remove);

export default router;
