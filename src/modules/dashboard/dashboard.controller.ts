// backend/src/modules/dashboard/dashboard.controller.ts
import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../utils/response.utils";
import { getStats, getActivity, getRecentTasks } from "./dashboard.service";

export const getDashboardStats = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const stats = await getStats();
    sendSuccess(res, stats);
  } catch (err) {
    next(err);
  }
};

export const getDashboardActivity = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const activity = await getActivity();
    sendSuccess(res, activity);
  } catch (err) {
    next(err);
  }
};

export const getDashboardTasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tasks = await getRecentTasks(req.user!.userId);
    sendSuccess(res, tasks);
  } catch (err) {
    next(err);
  }
};
