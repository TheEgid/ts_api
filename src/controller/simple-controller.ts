import { Controller, Get, OnUndefined, Param, UseAfter, UseBefore } from "routing-controllers";
import { loggingAfter, loggingBefore } from "../middleware/middleware";
import { getConnection } from "typeorm";
import { StatusCodes } from "http-status-codes";
import UsersRepository from "../repos/users-repository";
import ListUserService from "../services/ListUserService";

@Controller()
export default class SimpleController {
  @Get("/user/:id")
  @OnUndefined(StatusCodes.BAD_REQUEST)
  @UseBefore(loggingBefore)
  @UseAfter(loggingAfter)
  public async getUserById(@Param("id") id: string) {
    return await getConnection(process.env.DB_NAME)
      .getCustomRepository(UsersRepository)
      .findById(id);
  }

  @Get("/users")
  @OnUndefined(StatusCodes.BAD_REQUEST)
  public async getUsers() {
    const lse = new ListUserService();
    return await lse.execute();
  }
}

// import {
//   // Action,
//   JsonController,
//   Get,
//   // UseInterceptor
// } from "routing-controllers";
// import "reflect-metadata";
//
// @JsonController()
// export default class SimpleController {
//   @Get("/")
//   get() {
//     return { message: "Ok" };
//   }
// }
