import { Request } from "express";
import { Action, UnauthorizedError } from "routing-controllers";
import TokenService from "../services/token-service";

interface IResponseHeaders {
  token: string;
}

type ResponseHeaders = string[] & IResponseHeaders;

export async function authorizationChecker(action: Action): Promise<boolean> {
  const actionRequest = action.request as Request;
  const authorizationHeader = actionRequest.headers.authorization;
  if (authorizationHeader) {
    const header = authorizationHeader.split(" ", 2) as ResponseHeaders;
    const [, token] = header;
    const curUser = await TokenService.getUserByToken(token);
    if (curUser.id !== undefined) {
      return true;
    }
  } else {
    throw new UnauthorizedError("No token.");
  }
  return false;
}
