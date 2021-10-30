import { JsonController, Get, Param, UseAfter, UseBefore } from "routing-controllers";
import { loggingAfter, loggingBefore } from "../middleware/middleware";
import { getConnection } from "typeorm";
import User from "../models/user-entity";

@JsonController()
export default class UserController {
  @Get("/user/:id")
  @UseBefore(loggingBefore)
  @UseAfter(loggingAfter)
  public async getUserById(@Param("id") id: number) {
    const user = await getConnection(process.env.DB_NAME)
      .getRepository(User)
      .find({ where: { id: id } });
    return user || {};
  }

  @Get("/users")
  @UseBefore(loggingBefore)
  @UseAfter(loggingAfter)
  public async getUsers() {
    const users = await getConnection(process.env.DB_NAME).getRepository(User).find();
    return users || {};
  }
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
