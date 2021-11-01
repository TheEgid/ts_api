import { getConnection } from "typeorm";
import User from "../models/user-entity";
import { Request } from "express";
import TokenRepository from "../repos/tokens-repository";
import UsersRepository from "../repos/users-repository";
import TokenService from "./token-service";

// import { IPingResult, ping } from "@network-utils/tcp-ping";

export default class UserService {
  static async getUsers(): Promise<User[]> {
    return await getConnection(process.env.DB_NAME).getCustomRepository(UsersRepository).findAll();
  }

  async userSignin(user: User): Promise<string> {
    const usersRepository = getConnection(process.env.DB_NAME).getCustomRepository(UsersRepository);
    let userEmail = await usersRepository.findByEmailHashedPassword(
      user.email,
      user.hashedPassword
    );

    if (userEmail) {
      userEmail = await UserService.setToken(userEmail); // await
      await usersRepository.save(userEmail);
      return userEmail.token.accessToken;
    }
    return process.env.USER_SERVICE_RESPONSE; // error
  }

  async userSignup(newUser: User): Promise<string> {
    const usersRepository = getConnection(process.env.DB_NAME).getCustomRepository(UsersRepository);
    const userRepeat = await usersRepository.findByEmail(newUser.email);
    if (!userRepeat) {
      newUser = await UserService.setToken(newUser);
      await usersRepository.save(newUser);
      return newUser.token.accessToken;
    } else {
      return process.env.USER_SERVICE_RESPONSE;
    }
  }

  async getUserInfo(req: Request): Promise<User> {
    return await this.findUser(req);
  }

  protected async findUser(req: Request): Promise<User> {
    if (req.get(process.env.HEADER_AUTH)) {
      const [, token] = req.headers.authorization.split(" ", 2);
      return await TokenService.getUserByToken(token);
    }
  }

  private static async setToken(user: User): Promise<User> {
    const token: TokenRepository = new TokenRepository(); // CH to service
    user.token = await token.generate();
    return user;
  }
}

// if (action.request.headers.authorization) {
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
//   const [, token] = action.request.headers.authorization.split(" ", 2);
//   const curUser = await TokenService.getUser(token as string);

// getLatency(): Promise<IPingResult> {
//   function update(progress: number, total: number): void {
//     console.log(progress, "/", total);
//   }
//
//   // Метод такой-себе если честно, для ознакомления думаю покатит:)
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//   const latency = ping(
//     {
//       address: process.env.PING_ADRESS,
//       attempts: Number(process.env.PING_ATTEMPTS),
//       port: Number(process.env.PING_PORT),
//       timeout: Number(process.env.PING_TIMEOUT),
//     },
//     update
//   ).then((result) => {
//     console.log("ping result:", result);
//     return result;
//   });
//
//   return latency;
// }
//
// async userLogout(all: boolean, req: express.Request): Promise<void> {
//   // Создаем Mongo repository
//   const repository = getMongoRepository(User);
//   // Поиск по текущему токену
//   const user = await this.findUser(req, repository);
//
//   if (all) {
//     // Если true удаляем(заменяем пустыми, что тоже так себе. Опять же тупо с Mongo не очень удобно работать, так проще всего было. Так метод Update юзал) все токены
//     user.token.accessToken = process.env.GET_LOGOUT_TOKEN;
//     user.token.refreshToken = process.env.GET_LOGOUT_TOKEN;
//     // Сохраняем изменения
//     repository.save(user);
//   } else {
//     // Если false удаляем только текущий
//     user.token.accessToken = process.env.GET_LOGOUT_TOKEN;
//     // Сохраняем изменения
//     repository.save(user);
//   }
// }
