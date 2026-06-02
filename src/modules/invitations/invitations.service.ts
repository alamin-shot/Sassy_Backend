// backend/src/modules/invitations/invitations.service.ts
import Invitation from "../../models/Invitation.model";
import User from "../../models/User.model";
import Project from "../../models/Project.model";
import { AppError } from "../../middleware/errorHandler";
import { sendInviteEmail } from "../../utils/email.utils";

export const inviteToProject = async (
  projectId: string,
  inviterId: string,
  email: string,
) => {
  const project = await Project.findOne({ _id: projectId, owner: inviterId });
  if (!project) throw new AppError("Project not found or unauthorized", 404);
  const invitation = await Invitation.create({
    email,
    project: projectId,
    invitedBy: inviterId,
  });
  await sendInviteEmail(email, invitation.token);
  return invitation;
};

export const acceptInvitation = async (token: string, userId: string) => {
  const invitation = await Invitation.findOne({ token, status: "pending" });
  if (!invitation || invitation.expiresAt < new Date()) {
    throw new AppError("Invalid or expired invitation token", 400);
  }
  const project = await Project.findById(invitation.project);
  if (!project) throw new AppError("Project not found", 404);
  const alreadyMember = project.members.some(
    (m) => m.user.toString() === userId,
  );
  if (alreadyMember) throw new AppError("Already a project member", 409);
  project.members.push({ user: userId as any, role: "editor" });
  await project.save();
  invitation.status = "accepted";
  await invitation.save();
  return { message: "Invitation accepted", projectId: project._id };
};
