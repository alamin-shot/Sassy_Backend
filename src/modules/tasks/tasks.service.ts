// backend/src/modules/tasks/tasks.service.ts
import Task from "../../models/Task.model";
import Project from "../../models/Project.model";
import { AppError } from "../../middleware/errorHandler";
import {
  CreateTaskInput,
  UpdateTaskInput,
  ReorderTasksInput,
} from "./tasks.schema";

const verifyProjectMember = async (projectId: string, userId: string) => {
  const project = await Project.findOne({
    _id: projectId,
    $or: [{ owner: userId }, { "members.user": userId }],
  });
  if (!project) throw new AppError("Project not found or unauthorized", 404);
  return project;
};

export const createTask = async (
  projectId: string,
  userId: string,
  data: CreateTaskInput,
) => {
  await verifyProjectMember(projectId, userId);
  const maxPos = await Task.findOne({ project: projectId, status: "todo" })
    .sort("-position")
    .select("position");
  const position = (maxPos?.position || 0) + 1000;
  const task = await Task.create({
    title: data.title,
    description: data.description,
    priority: data.priority,
    assignee: data.assignee || undefined,
    dueDate: data.dueDate,
    project: projectId,
    position,
  });
  return task;
};

export const getProjectTasks = async (
  projectId: string,
  userId: string,
  status?: string,
) => {
  await verifyProjectMember(projectId, userId);
  const filter: any = { project: projectId };
  if (status) filter.status = status;
  const tasks = await Task.find(filter)
    .populate("assignee", "name email avatar")
    .sort("position");
  return tasks;
};

export const updateTask = async (
  taskId: string,
  userId: string,
  data: UpdateTaskInput,
) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError("Task not found", 404);
  await verifyProjectMember(task.project.toString(), userId);
  Object.assign(task, data);
  await task.save();
  return task.populate("assignee", "name email avatar");
};

export const deleteTask = async (taskId: string, userId: string) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError("Task not found", 404);
  await verifyProjectMember(task.project.toString(), userId);
  await Task.findByIdAndDelete(taskId);
  return { message: "Task deleted" };
};

export const reorderTask = async (userId: string, data: ReorderTasksInput) => {
  const task = await Task.findById(data.taskId);
  if (!task) throw new AppError("Task not found", 404);
  await verifyProjectMember(task.project.toString(), userId);
  task.status = data.newStatus;
  task.position = data.newPosition;
  await task.save();
  return task;
};
