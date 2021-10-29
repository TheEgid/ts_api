import { Controller, Get, Param, UseAfter, UseBefore } from "routing-controllers";
import { loggingAfter, loggingBefore } from "../middleware/middleware";
import { getConnection } from "typeorm";
import User from "../models/user-entity";

@Controller()
export default class UserController {
  @Get("/users/:id")
  @UseBefore(loggingBefore)
  @UseAfter(loggingAfter)
  public async getUserById(@Param("id") id: number) {
    const user = await getConnection(process.env.DB_NAME)
      .getRepository(User)
      .find({ where: { id: id } });
    return user || {};
  }

  // getOne(@Param("id") id: number) {
  //   console.log("do something in GET function...");
  //   console.log(id);
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-floating-promises
  //
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
