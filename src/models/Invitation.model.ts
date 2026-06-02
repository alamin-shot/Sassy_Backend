// backend/src/models/Invitation.model.ts
import mongoose, { Schema, Document } from "mongoose";
import crypto from "crypto";

export interface IInvitation extends Document {
  email: string;
  project: mongoose.Types.ObjectId;
  invitedBy: mongoose.Types.ObjectId;
  token: string;
  status: "pending" | "accepted" | "expired";
  expiresAt: Date;
  createdAt: Date;
}

const invitationSchema = new Schema<IInvitation>({
  email: { type: String, required: true, lowercase: true },
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  invitedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
    default: () => crypto.randomBytes(32).toString("hex"),
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "expired"],
    default: "pending",
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  },
  createdAt: { type: Date, default: Date.now },
});

invitationSchema.index({ email: 1, project: 1 });

export default mongoose.model<IInvitation>("Invitation", invitationSchema);
