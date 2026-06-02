// backend/src/modules/users/users.controller.ts
import { Request, Response, NextFunction } from "express";
import { getUserById, updateProfile, changePassword } from "./users.service";
import { sendSuccess } from "../../utils/response.utils";

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await getUserById(req.user!.userId);
    sendSuccess(res, user);
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await updateProfile(req.user!.userId, req.body);
    sendSuccess(res, user, "Profile updated");
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await changePassword(
      req.user!.userId,
      req.body.oldPassword,
      req.body.newPassword,
    );
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};
