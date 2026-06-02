// backend/src/models/Project.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  name: string;
  description?: string;
  owner: mongoose.Types.ObjectId;
  members: Array<{
    user: mongoose.Types.ObjectId;
    role: "owner" | "editor" | "viewer";
  }>;
  status: "active" | "archived" | "deleted";
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, maxlength: 500 },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        role: {
          type: String,
          enum: ["owner", "editor", "viewer"],
          default: "editor",
        },
      },
    ],
    status: {
      type: String,
      enum: ["active", "archived", "deleted"],
      default: "active",
    },
  },
  { timestamps: true },
);

projectSchema.index({ owner: 1 });
projectSchema.index({ "members.user": 1 });

export default mongoose.model<IProject>("Project", projectSchema);
