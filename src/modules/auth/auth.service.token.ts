// backend/src/modules/auth/auth.service.token.ts
import RefreshToken from "../../models/RefreshToken.model";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.utils";
import { setAuthCookies, clearAuthCookies } from "../../utils/cookie.utils";
import { AppError } from "../../middleware/errorHandler";
import { Request, Response } from "express";
import crypto from "crypto";

export const refreshAccessToken = async (req: Request, res: Response) => {
  const token = req.cookies?.refresh_token;
  if (!token) {
    throw new AppError("No refresh token provided", 401);
  }

  const decoded = verifyRefreshToken(token);
  const stored = await RefreshToken.findOne({ token, revoked: false });
  if (!stored || stored.user.toString() !== decoded.userId) {
    throw new AppError("Invalid refresh token", 401);
  }

  // Reuse detection: if token is from the same family but token doesn't match, revoke all
  if (stored.family !== decoded.tokenFamily) {
    await RefreshToken.updateMany(
      { family: decoded.tokenFamily },
      { revoked: true },
    );
    clearAuthCookies(res);
    throw new AppError("Token reuse detected. All sessions revoked.", 401);
  }

  // Rotate: revoke old token, issue new pair
  stored.revoked = true;
  await stored.save();

  const newFamily = crypto.randomBytes(16).toString("hex");
  const accessToken = signAccessToken({
    userId: decoded.userId,
    role: decoded.role,
  });
  const newRefreshToken = signRefreshToken({
    userId: decoded.userId,
    role: decoded.role,
    tokenFamily: newFamily,
  });

  await RefreshToken.create({
    user: stored.user,
    token: newRefreshToken,
    family: newFamily,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  setAuthCookies(res, accessToken, newRefreshToken);
  return { message: "Token refreshed" };
};

export const logoutUser = async (req: Request, res: Response) => {
  const token = req.cookies?.refresh_token;
  if (token) {
    await RefreshToken.updateMany({ token }, { revoked: true });
  }
  clearAuthCookies(res);
  return { message: "Logged out successfully" };
};
