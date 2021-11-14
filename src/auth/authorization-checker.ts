import { Request } from "express";
import { Action } from "routing-controllers";
import TokenService from "../services/token-service";
import User from "../models/user-entity";
import ControllerError from "../controller/ControllerError";
import { StatusCodes } from "http-status-codes";

export async function authorizationChecker(action: Action): Promise<boolean> {
  const actionRequest = action.request as Request;
  const authorizationHeader = actionRequest.headers.authorization;
  if (authorizationHeader) {
    const header = authorizationHeader.split(" ", 2);
    const [, token] = header;
    const curUser = await TokenService.getUserByToken(token);
    if (curUser instanceof User) {
      return true;
    }
  } else {
    throw new ControllerError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }
  return false;
}
