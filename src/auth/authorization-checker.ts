import { Request } from "express";
import { Action } from "routing-controllers";
import TokenService from "../services/token-service";
import { Unauthorized } from "http-json-errors";
import User from "../models/user-entity";

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
    if (curUser instanceof User) {
      return true;
    }
  } else {
    throw new Unauthorized("Unauthorized");
  }
  return false;
}
