// backend/src/modules/teams/teams.routes.ts
import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { create, list, addMember } from "./teams.controller";

const router = Router();
router.use(authenticate);
router.post("/", create);
router.get("/", list);
router.post("/:id/members", addMember);

export default router;
