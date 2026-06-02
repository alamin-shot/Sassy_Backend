// backend/src/modules/auth/auth.controller.ts
import { Request, Response, NextFunction } from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "./auth.service";
import { sendSuccess } from "../../utils/response.utils";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await registerUser(req.body, res);
    sendSuccess(res, user, "Registration successful", 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await loginUser(req.body, res);
    sendSuccess(res, user, "Login successful");
  } catch (err) {
    next(err);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await refreshAccessToken(req, res);
    sendSuccess(res, result, "Token refreshed");
  } catch (err) {
    next(err);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await logoutUser(req, res);
    sendSuccess(res, result, "Logged out");
  } catch (err) {
    next(err);
  }
};

export const forgot = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await forgotPassword(req.body.email);
    sendSuccess(res, result, "Password reset email sent");
  } catch (err) {
    next(err);
  }
};

export const reset = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await resetPassword(req.body.token, req.body.password);
    sendSuccess(res, result, "Password reset successful");
  } catch (err) {
    next(err);
  }
};
