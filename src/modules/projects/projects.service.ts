// backend/src/modules/projects/projects.service.ts
import Project from "../../models/Project.model";
import User from "../../models/User.model";
import { AppError } from "../../middleware/errorHandler";
import {
  CreateProjectInput,
  UpdateProjectInput,
  AddMemberInput,
} from "./projects.schema";
import {
  getPaginationMeta,
  getPaginationParams,
} from "../../utils/pagination.utils";

export const createProject = async (
  ownerId: string,
  data: CreateProjectInput,
) => {
  const project = await Project.create({
    ...data,
    owner: ownerId,
    members: [{ user: ownerId, role: "owner" }],
  });
  return project.populate("owner", "name email avatar");
};

export const getUserProjects = async (
  userId: string,
  pageQuery?: string | number,
  limitQuery?: string | number,
) => {
  const { page, limit } = getPaginationParams(pageQuery, limitQuery);
  const filter = {
    $or: [{ owner: userId }, { "members.user": userId }],
    status: { $ne: "deleted" as const },
  };
  const total = await Project.countDocuments(filter);
  const projects = await Project.find(filter)
    .populate("owner", "name email avatar")
    .sort({ updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  const pagination = getPaginationMeta(total, page, limit);
  return { projects, pagination };
};

export const getProjectById = async (projectId: string, userId: string) => {
  const project = await Project.findOne({
    _id: projectId,
    $or: [{ owner: userId }, { "members.user": userId }],
  }).populate("members.user", "name email avatar");
  if (!project) throw new AppError("Project not found", 404);
  return project;
};

export const updateProject = async (
  projectId: string,
  userId: string,
  data: UpdateProjectInput,
) => {
  const project = await Project.findOneAndUpdate(
    { _id: projectId, owner: userId },
    data,
    { new: true, runValidators: true },
  );
  if (!project) throw new AppError("Project not found or unauthorized", 404);
  return project;
};

export const deleteProject = async (projectId: string, userId: string) => {
  const project = await Project.findOneAndUpdate(
    { _id: projectId, owner: userId },
    { status: "deleted" },
    { new: true },
  );
  if (!project) throw new AppError("Project not found or unauthorized", 404);
  return project;
};

export const addMember = async (
  projectId: string,
  ownerId: string,
  input: AddMemberInput,
) => {
  const project = await Project.findOne({ _id: projectId, owner: ownerId });
  if (!project) throw new AppError("Project not found or unauthorized", 404);
  const user = await User.findOne({ email: input.email });
  if (!user) throw new AppError("User with that email not found", 404);
  const alreadyMember = project.members.some(
    (m) => m.user.toString() === user._id.toString(),
  );
  if (alreadyMember) throw new AppError("User is already a member", 409);
  project.members.push({ user: user._id, role: input.role });
  await project.save();
  return project.populate("members.user", "name email avatar");
};

export const removeMember = async (
  projectId: string,
  ownerId: string,
  memberId: string,
) => {
  const project = await Project.findOne({ _id: projectId, owner: ownerId });
  if (!project) throw new AppError("Project not found or unauthorized", 404);
  project.members = project.members.filter(
    (m) => m.user.toString() !== memberId,
  );
  await project.save();
  return project;
};
