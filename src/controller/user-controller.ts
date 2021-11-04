import {
  Authorized,
  Body,
  Get,
  JsonController,
  NotFoundError,
  Post,
  Req,
  UnauthorizedError,
  OnUndefined,
} from "routing-controllers";
import UserService from "../services/user-service";
import User from "../models/user-entity";
import { Request } from "express";
import { StatusCodes } from "http-status-codes";
import { IPingResult } from "@network-utils/tcp-ping";

@JsonController()
export default class UserController {
  userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // Регистрация пользователя
  @Post("/signup")
  @OnUndefined(StatusCodes.BAD_REQUEST)
  async registrateUser(@Body() user: User): Promise<string> {
    const responseSignup = await this.userService.userSignup(user);
    if (responseSignup !== process.env.USER_SERVICE_RESPONSE) {
      return responseSignup;
    } else {
      throw new UnauthorizedError(process.env.POST_SIGNUP_MASSAGE);
    }
  }

  @Post("/signin")
  @OnUndefined(StatusCodes.BAD_REQUEST)
  async login(@Body() user: User): Promise<string> {
    const responseSignin = await this.userService.userSignin(user);
    if (responseSignin !== process.env.USER_SERVICE_RESPONSE) {
      return responseSignin;
    } else {
      throw new NotFoundError(process.env.POST_SIGNIN_MASSAGE);
    }
  }

  // Возвращает авторизированного пользователя
  @Authorized()
  @Get("/info")
  @OnUndefined(StatusCodes.BAD_REQUEST)
  async getId(@Req() req: Request): Promise<User> {
    return await this.userService.getUserInfo(req);
  }

  // Время задержки сервера
  @Authorized()
  @Get("/latency")
  async getPing(): Promise<IPingResult> {
    return await this.userService.getLatency();
  }
}

// @Controller()
// export default class UserController {
//   @Get("/user/:id")
//   @OnUndefined(StatusCodes.BAD_REQUEST)
//   @UseBefore(loggingBefore)
//   @UseAfter(loggingAfter)
//   public async getUserById(@Param("id") id: string) {
//     return await getConnection(process.env.DB_NAME)
//       .getCustomRepository(UsersRepository)
//       .findById(id);
//   }
//

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
// }

// @Get("/")
// // Протестировано добавление заголовков
// @Header("Access-Control-Allow-Origin", "*")
// @Header(
//   "Access-Control-Allow-Headers",
//   "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token"
// )
// getStart() {
//   return { message: "Server is running" };
// }
