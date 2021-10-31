import {
  Get,
  Post,
  Body,
  Header,
  JsonController,
  UnauthorizedError,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Param,
} from "routing-controllers";
import UserService from "../services/user-service";
import User from "../models/user-entity";

@JsonController()
export default class UserController {
  userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  @Get("/")
  // Протестировано добавление заголовков
  @Header("Access-Control-Allow-Origin", "*")
  @Header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token"
  )
  getStart() {
    return { message: process.env.SERVER_MSG };
  }

  // Регистрация пользователя
  @Post("/signup")
  async registrateUser(@Body() user: User): Promise<string> {
    // @Param("transactionId");
    // console.log(transactionId);
    const responseSignup = await this.userService.userSignup(user);
    if (responseSignup !== process.env.USER_SERVICE_RESPONSE) {
      return responseSignup;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      throw new UnauthorizedError(process.env.POST_SIGNUP_MASSAGE);
    }
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
