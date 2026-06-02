// backend/src/modules/users/users.service.ts
import User from "../../models/User.model";
import { AppError } from "../../middleware/errorHandler";

export const getUserById = async (userId: string) => {
  const user = await User.findById(userId).select("-__v");
  if (!user) throw new AppError("User not found", 404);
  return user;
};

export const updateProfile = async (
  userId: string,
  data: { name?: string; avatar?: string },
) => {
  const user = await User.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
  }).select("-__v");
  if (!user) throw new AppError("User not found", 404);
  return user;
};

export const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
) => {
  const user = await User.findById(userId).select("+password");
  if (!user) throw new AppError("User not found", 404);
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) throw new AppError("Current password is incorrect", 400);
  user.password = newPassword;
  user.passwordChangedAt = new Date();
  await user.save();
  return { message: "Password updated" };
};
