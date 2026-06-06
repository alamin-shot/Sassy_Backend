// backend/src/modules/dashboard/dashboard.service.ts
import User from "../../models/User.model";
import Project from "../../models/Project.model";
import Task from "../../models/Task.model";

export const getStats = async () => {
  const totalProjects = await Project.countDocuments();
  const activeTasks = await Task.countDocuments({ status: { $ne: "done" } });
  const completedThisWeek = await Task.countDocuments({
    status: "done",
    updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  });
  const teamMembers = await User.countDocuments();
  return { totalProjects, activeTasks, completedThisWeek, teamMembers };
};

export const getActivity = async () => {
  const recentProjects = await Project.find()
    .sort({ updatedAt: -1 })
    .limit(5)
    .populate("owner", "name email avatar");
  return recentProjects.map((p, i) => ({
    id: `p-${p._id}`,
    user: p.owner,
    action: "updated project",
    target: p.name,
    timestamp: p.updatedAt,
  }));
};

export const getRecentTasks = async (userId: string) => {
  return Task.find({ assignee: userId })
    .sort({ updatedAt: -1 })
    .limit(5)
    .populate("assignee", "name email avatar");
};
