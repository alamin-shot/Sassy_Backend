// backend/src/modules/admin/admin.controller.ts
import { Request, Response, NextFunction } from "express";
import * as adminService from "./admin.service";
import { sendSuccess } from "../../utils/response.utils";
import { getParam } from "../../utils/params.utils";

export const stats = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await adminService.getPlatformStats();
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
};

export const users = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = req.query.page as string | undefined;
    const limit = req.query.limit as string | undefined;
    const search = req.query.search as string | undefined;
    const result = await adminService.getUsers(page, limit, search);
    sendSuccess(res, result.users, "Users fetched", 200, result.pagination);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getParam(req.params.id);
    const user = await adminService.updateUserStatus(userId, req.body);
    sendSuccess(res, user, "User updated");
  } catch (err) {
    next(err);
  }
};

export const projects = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = req.query.page as string | undefined;
    const limit = req.query.limit as string | undefined;
    const result = await adminService.getAllProjects(page, limit);
    sendSuccess(
      res,
      result.projects,
      "Projects fetched",
      200,
      result.pagination,
    );
  } catch (err) {
    next(err);
  }
};
