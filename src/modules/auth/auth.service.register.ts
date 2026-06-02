// backend/src/modules/auth/auth.service.register.ts
import User from "../../models/User.model";
import { signAccessToken, signRefreshToken } from "../../utils/jwt.utils";
import RefreshToken from "../../models/RefreshToken.model";
import { setAuthCookies } from "../../utils/cookie.utils";
import { AppError } from "../../middleware/errorHandler";
import { RegisterInput } from "./auth.schema";
import { Response } from "express";
import crypto from "crypto";

export const registerUser = async (input: RegisterInput, res: Response) => {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw new AppError("Email already in use", 409);
  }

  const user = await User.create({
    name: input.name,
    email: input.email,
    password: input.password,
  });

  // Generate tokens
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

  // Store refresh token
  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    family: tokenFamily,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  setAuthCookies(res, accessToken, refreshToken);

  // Return user without password
  const { password, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};
