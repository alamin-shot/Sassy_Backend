// backend/src/modules/projects/projects.routes.ts
import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
} from "./projects.schema";
import {
  create,
  list,
  getById,
  update,
  remove,
  addMember,
  removeMember,
} from "./projects.controller";

const router = Router();
router.use(authenticate);

router.post("/", validate(createProjectSchema), create);
router.get("/", list);
router.get("/:id", getById);
router.patch("/:id", validate(updateProjectSchema), update);
router.delete("/:id", remove);
router.post("/:id/members", validate(addMemberSchema), addMember);
router.delete("/:id/members/:memberId", removeMember);

export default router;
