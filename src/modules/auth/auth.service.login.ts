// backend/src/modules/auth/auth.service.login.ts
import User from "../../models/User.model";
import { signAccessToken, signRefreshToken } from "../../utils/jwt.utils";
import RefreshToken from "../../models/RefreshToken.model";
import { setAuthCookies } from "../../utils/cookie.utils";
import { AppError } from "../../middleware/errorHandler";
import { LoginInput } from "./auth.schema";
import { Response } from "express";
import crypto from "crypto";

export const loginUser = async (input: LoginInput, res: Response) => {
  const user = await User.findOne({ email: input.email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await user.comparePassword(input.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AppError("Account suspended. Contact support.", 403);
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const accessToken = signAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });
  const tokenFamily = crypto.randomBytes(16).toString("hex");
  const refreshToken = signRefreshToken({
    userId: user._id.toString(),
    role: user.role,
    tokenFamily,
  });

  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    family: tokenFamily,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  setAuthCookies(res, accessToken, refreshToken);

  const { password, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};
