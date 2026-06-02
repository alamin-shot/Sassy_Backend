// backend/src/models/RefreshToken.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IRefreshToken extends Document {
  user: mongoose.Types.ObjectId;
  token: string;
  family: string; // rotation detection
  expiresAt: Date;
  revoked: boolean;
  createdAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: { type: String, required: true, unique: true },
  family: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  revoked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

refreshTokenSchema.index({ user: 1, family: 1 });

export default mongoose.model<IRefreshToken>(
  "RefreshToken",
  refreshTokenSchema,
);
