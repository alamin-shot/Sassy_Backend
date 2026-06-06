// backend/src/app.ts
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { corsOptions } from "./config/cors";
import { errorHandler } from "./middleware/errorHandler";
import { authLimiter, apiLimiter } from "./middleware/rateLimiter";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/users.routes";
import projectRoutes from "./modules/projects/projects.routes";
import taskRoutes from "./modules/tasks/tasks.routes";
import teamRoutes from "./modules/teams/teams.routes";
import invitationRoutes from "./modules/invitations/invitations.routes";
import adminRoutes from "./modules/admin/admin.routes";
import uploadRoutes from "./modules/uploads/uploads.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";

const app = express();

app.use(cors(corsOptions));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Static files — uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Rate limiting
app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);

// Routes
// Add with other route mounts:
app.use("/api/users/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects/:projectId/tasks", taskRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", uploadRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// Global error handler
app.use(errorHandler);

export default app;
