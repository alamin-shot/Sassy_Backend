// backend/src/modules/projects/projects.controller.ts
import { Request, Response, NextFunction } from "express";
import * as projectService from "./projects.service";
import { sendSuccess } from "../../utils/response.utils";
import { getParam } from "../../utils/params.utils";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const project = await projectService.createProject(
      req.user!.userId,
      req.body,
    );
    sendSuccess(res, project, "Project created", 201);
  } catch (err) {
    next(err);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page as string | undefined;
    const limit = req.query.limit as string | undefined;
    const { projects, pagination } = await projectService.getUserProjects(
      req.user!.userId,
      page,
      limit,
    );
    sendSuccess(res, projects, "Projects fetched", 200, pagination);
  } catch (err) {
    next(err);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const projectId = getParam(req.params.id);
    const project = await projectService.getProjectById(
      projectId,
      req.user!.userId,
    );
    sendSuccess(res, project);
  } catch (err) {
    next(err);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const projectId = getParam(req.params.id);
    const project = await projectService.updateProject(
      projectId,
      req.user!.userId,
      req.body,
    );
    sendSuccess(res, project, "Project updated");
  } catch (err) {
    next(err);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const projectId = getParam(req.params.id);
    const project = await projectService.deleteProject(
      projectId,
      req.user!.userId,
    );
    sendSuccess(res, project, "Project deleted");
  } catch (err) {
    next(err);
  }
};

export const addMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const projectId = getParam(req.params.id);
    const project = await projectService.addMember(
      projectId,
      req.user!.userId,
      req.body,
    );
    sendSuccess(res, project, "Member added");
  } catch (err) {
    next(err);
  }
};

export const removeMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const projectId = getParam(req.params.id);
    const memberId = getParam(req.params.memberId);
    const project = await projectService.removeMember(
      projectId,
      req.user!.userId,
      memberId,
    );
    sendSuccess(res, project, "Member removed");
  } catch (err) {
    next(err);
  }
};
