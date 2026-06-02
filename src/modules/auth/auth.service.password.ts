// backend/src/modules/auth/auth.service.password.ts
import User from "../../models/User.model";
import crypto from "crypto";
import { AppError } from "../../middleware/errorHandler";
import { sendPasswordResetEmail } from "../../utils/email.utils";

const resetTokens = new Map<string, { userId: string; expires: Date }>(); // in-memory for demo; use DB in production

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal user existence
    return { message: "If that email exists, a reset link has been sent." };
  }

  const token = crypto.randomBytes(32).toString("hex");
  resetTokens.set(token, {
    userId: user._id.toString(),
    expires: new Date(Date.now() + 3600000), // 1 hour
  });

  // In production, send email with token
  await sendPasswordResetEmail(email, token);

  return { message: "If that email exists, a reset link has been sent." };
};

export const resetPassword = async (token: string, newPassword: string) => {
  const data = resetTokens.get(token);
  if (!data || data.expires < new Date()) {
    resetTokens.delete(token);
    throw new AppError("Invalid or expired reset token", 400);
  }

  const user = await User.findById(data.userId).select("+password");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.password = newPassword;
  user.passwordChangedAt = new Date();
  await user.save();

  resetTokens.delete(token);
  return { message: "Password reset successful" };
};
