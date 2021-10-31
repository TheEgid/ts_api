import { Controller, Get, OnUndefined, Param, UseAfter, UseBefore } from "routing-controllers";
import { loggingAfter, loggingBefore } from "../middleware/middleware";
import { getConnection } from "typeorm";
import { StatusCodes } from "http-status-codes";
import UsersRepository from "../repos/users-repository";
import ListUserService from "../services/ListUserService";

@Controller()
export default class UserController {
  @Get("/user/:id")
  @OnUndefined(StatusCodes.BAD_REQUEST)
  @UseBefore(loggingBefore)
  @UseAfter(loggingAfter)
  public async getUserById(@Param("id") id: number) {
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

  // public async getUsers() {
  //   return await getConnection(process.env.DB_NAME).getCustomRepository(UsersRepository).findAll();
  // }

  // return await getConnection(process.env.DB_NAME)
  //   .getRepository(User)
  //   .findOne({ where: { id: id } });

  // getOne(@Param("id") id: number) {
  //   console.log("do something in GET function...");
  //   console.log(id);

  //   connection()
  // DatabaseConnectionFacade.multipleConnections().then(() =>
  //   getRepository(User).find({ where: { id: id } })
  // );
  // return getConnection()
  // return `This action returns user #${id}`;

  // @Post("/users/:id")
  // @OnUndefined(204)
  // postOne(@Param("id") id: number, @Body() info: Info) {
  //   console.log(JSON.stringify(info));
  //   console.log(`tracedId = ${httpContext.get("traceId") as string}`);
  // }
}
