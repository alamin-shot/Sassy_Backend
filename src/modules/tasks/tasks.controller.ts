// backend/src/modules/tasks/tasks.controller.ts
import { Request, Response, NextFunction } from "express";
import * as taskService from "./tasks.service";
import { sendSuccess } from "../../utils/response.utils";

const getParam = (param: string | string[]) =>
  Array.isArray(param) ? param[0] : param;

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const projectId = getParam(req.params.projectId);
    const task = await taskService.createTask(
      projectId,
      req.user!.userId,
      req.body,
    );
    sendSuccess(res, task, "Task created", 201);
  } catch (err) {
    next(err);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = getParam(req.params.projectId);
    const tasks = await taskService.getProjectTasks(
      projectId,
      req.user!.userId,
      req.query.status as string,
    );
    sendSuccess(res, tasks);
  } catch (err) {
    next(err);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const taskId = getParam(req.params.id);
    const task = await taskService.updateTask(
      taskId,
      req.user!.userId,
      req.body,
    );
    sendSuccess(res, task, "Task updated");
  } catch (err) {
    next(err);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const taskId = getParam(req.params.id);
    const result = await taskService.deleteTask(
      taskId,
      req.user!.userId,
    );
    sendSuccess(res, result, "Task deleted");
  } catch (err) {
    next(err);
  }
};

export const reorder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const task = await taskService.reorderTask(req.user!.userId, req.body);
    sendSuccess(res, task, "Task reordered");
  } catch (err) {
    next(err);
  }
};
