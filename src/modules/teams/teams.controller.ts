// backend/src/modules/teams/teams.controller.ts
import { Request, Response, NextFunction } from "express";
import * as teamService from "./teams.service";
import { sendSuccess } from "../../utils/response.utils";
import { getParam } from "../../utils/params.utils";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const team = await teamService.createTeam(req.user!.userId, req.body.name);
    sendSuccess(res, team, "Team created", 201);
  } catch (err) {
    next(err);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teams = await teamService.getUserTeams(req.user!.userId);
    sendSuccess(res, teams);
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
    const teamId = getParam(req.params.id);
    const userId = getParam(req.body.userId);
    const team = await teamService.addMember(teamId, req.user!.userId, userId);
    sendSuccess(res, team, "Member added");
  } catch (err) {
    next(err);
  }
};
