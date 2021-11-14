import { Authorized, Get, JsonController, Req } from "routing-controllers";
import { Request } from "express";
import { StatusCodes } from "http-status-codes";
import UserAdminService from "../services/user-admin-service";
import TokenService from "../services/token-service";
import ControllerError from "./ControllerError";

const isAdminCheck = async (request: Request): Promise<boolean> => {
  const authorizationHeader = request.headers.authorization;
  const header = authorizationHeader.split(" ", 2);
  const [, token] = header;
  const user = await TokenService.getUserByToken(token);
  return user.isAdmin;
};

@JsonController()
export default class UserAdminController {
  // @Get("/user/:id")
  // @OnUndefined(StatusCodes.BAD_REQUEST)
  // @UseBefore(loggingBefore)
  // @UseAfter(loggingAfter)
  // public async getUserById(@Param("id") id: string) {
  //   return await getConnection(process.env.DB_NAME)
  //     .getCustomRepository(UsersRepository)
  //     .findById(id);
  // }

  // https://habr.com/ru/company/oleg-bunin/blog/433322/

  @Authorized()
  @Get("/users")
  public async getUsers(@Req() request: Request) {
    const isAdmin = await isAdminCheck(request);
    if (isAdmin) {
      return await UserAdminService.getUsers();
    } else {
      throw new ControllerError(StatusCodes.FORBIDDEN, "Forbidden!");
    }
  }
}
