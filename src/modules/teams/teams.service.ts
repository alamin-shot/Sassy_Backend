// backend/src/modules/teams/teams.service.ts
import Team from "../../models/Team.model";
import { AppError } from "../../middleware/errorHandler";

export const createTeam = async (ownerId: string, name: string) => {
  const team = await Team.create({
    name,
    owner: ownerId,
    members: [{ user: ownerId, role: "lead" }],
  });
  return team.populate("members.user", "name email avatar");
};

export const getUserTeams = async (userId: string) => {
  return Team.find({ "members.user": userId }).populate(
    "members.user",
    "name email avatar",
  );
};

export const addMember = async (
  teamId: string,
  userId: string,
  memberId: string,
) => {
  const team = await Team.findOne({ _id: teamId, owner: userId });
  if (!team) throw new AppError("Team not found or unauthorized", 404);
  if (team.members.some((m) => m.user.toString() === memberId)) {
    throw new AppError("Already a member", 409);
  }
  team.members.push({ user: memberId as any, role: "member" });
  await team.save();
  return team.populate("members.user", "name email avatar");
};
