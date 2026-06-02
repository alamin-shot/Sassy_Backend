// backend/src/modules/invitations/invitations.routes.ts
import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { inviteToProject, acceptInvitation } from "./invitations.service";
import { sendSuccess } from "../../utils/response.utils";

const router = Router();
router.use(authenticate);

router.post("/", async (req, res, next) => {
  try {
    const invitation = await inviteToProject(
      req.body.projectId,
      req.user!.userId,
      req.body.email,
    );
    sendSuccess(res, invitation, "Invitation sent", 201);
  } catch (err) {
    next(err);
  }
});

router.post("/accept", async (req, res, next) => {
  try {
    const result = await acceptInvitation(req.body.token, req.user!.userId);
    sendSuccess(res, result, "Invitation accepted");
  } catch (err) {
    next(err);
  }
});

export default router;
