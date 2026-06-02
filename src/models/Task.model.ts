// backend/src/models/Task.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  project: mongoose.Types.ObjectId;
  assignee?: mongoose.Types.ObjectId;
  dueDate?: Date;
  position: number; // for kanban ordering (higher = later)
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, maxlength: 150 },
    description: { type: String, maxlength: 2000 },
    status: {
      type: String,
      enum: ["todo", "in_progress", "review", "done"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignee: { type: Schema.Types.ObjectId, ref: "User" },
    dueDate: { type: Date },
    position: { type: Number, default: 0 },
  },
  { timestamps: true },
);

taskSchema.index({ project: 1, status: 1, position: 1 });
taskSchema.index({ assignee: 1 });

export default mongoose.model<ITask>("Task", taskSchema);
