// backend/src/modules/admin/admin.service.ts
import User from "../../models/User.model";
import Project from "../../models/Project.model";
import Task from "../../models/Task.model";
import type { PaginationMeta } from "../../types/api.types";
import { AppError } from "../../middleware/errorHandler";
import {
  getPaginationMeta,
  getPaginationParams,
} from "../../utils/pagination.utils";

export const getPlatformStats = async () => {
  const totalUsers = await User.countDocuments();
  const activeProjects = await Project.countDocuments({ status: "active" });
  const tasksCompleted = await Task.countDocuments({ status: "done" });
  const newSignupsThisMonth = await User.countDocuments({
    createdAt: { $gte: new Date(new Date().setDate(1)) },
  });
  const growthPercent = 12.5;
  return {
    totalUsers,
    activeProjects,
    tasksCompleted,
    newSignupsThisMonth,
    growthPercent,
  };
};

export const getUsers = async (
  pageQuery?: string | number,
  limitQuery?: string | number,
  search?: string,
) => {
  const { page, limit } = getPaginationParams(pageQuery, limitQuery);

  const filter: Record<string, unknown> = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .select("-__v -password")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  const pagination = getPaginationMeta(total, page, limit);
  return { users, pagination };
};

export const updateUserStatus = async (
  userId: string,
  updates: { isActive?: boolean; role?: string },
) => {
  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
  }).select("-__v -password");
  if (!user) throw new AppError("User not found", 404);
  return user;
};

export const getAllProjects = async (
  pageQuery?: string | number,
  limitQuery?: string | number,
) => {
  const { page, limit } = getPaginationParams(pageQuery, limitQuery);
  const total = await Project.countDocuments();
  const projects = await Project.find()
    .populate("owner", "name email")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  const pagination: PaginationMeta = getPaginationMeta(total, page, limit);
  return { projects, pagination };
};
