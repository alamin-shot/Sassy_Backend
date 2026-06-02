// backend/src/models/Team.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ITeam extends Document {
  name: string;
  owner: mongoose.Types.ObjectId;
  members: Array<{
    user: mongoose.Types.ObjectId;
    role: "member" | "lead";
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, trim: true },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["member", "lead"], default: "member" },
      },
    ],
  },
  { timestamps: true },
);

teamSchema.index({ owner: 1 });

export default mongoose.model<ITeam>("Team", teamSchema);
