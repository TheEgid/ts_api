import { getConnection } from "typeorm";
import User from "../models/user-entity";
import { Request } from "express";
// import TokenRepository from "../repos/tokens-repository";
import UsersRepository from "../repos/users-repository";
import TokenService from "./token-service";
import { IPingResult, ping } from "@network-utils/tcp-ping";

export default class UserService {
  static async getUsers(): Promise<User[]> {
    return await getConnection(process.env.DB_NAME).getCustomRepository(UsersRepository).findAll();
  }

  // Регистрация пользователя
  async userSignup(newUser: User): Promise<string> {
    const usersRepository = getConnection(process.env.DB_NAME).getCustomRepository(UsersRepository);
    const userRepeat = await usersRepository.findByEmail(newUser.email);
    console.log(userRepeat);
    if (!userRepeat) {
      newUser = await TokenService.setToken(newUser);
      await usersRepository.save(newUser);
      return newUser.token.accessToken;
    } else {
      return `Already logged as ${newUser.email}`;
    }
  }

  async userSignin(user: User): Promise<string> {
    const usersRepository = getConnection(process.env.DB_NAME).getCustomRepository(UsersRepository);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let oldUser = await usersRepository.findByEmailHashedPassword(user.email, user.hashedPassword);
    console.log(oldUser);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (oldUser.id !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      oldUser = await TokenService.setToken(oldUser);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await usersRepository.save(oldUser);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
      return oldUser.token.refreshToken;
    }
    return process.env.USER_SERVICE_RESPONSE; // error
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

  async getLatency(): Promise<IPingResult> {
    function update(progress: number, total: number): void {
      console.log(progress, "/", total);
    }
    return await ping(
      {
        address: process.env.PING_ADRESS,
        attempts: Number(process.env.PING_ATTEMPTS),
        port: Number(process.env.PING_PORT),
        timeout: Number(process.env.PING_TIMEOUT),
      },
      update
    ).then((result) => {
      console.log("ping result:", result);
      return result;
    });
  }
}

// if (action.request.headers.authorization) {
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
//   const [, token] = action.request.headers.authorization.split(" ", 2);
//   const curUser = await TokenService.getUser(token as string);

// async userLogout(all: boolean, req: express.Request): Promise<void> {
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
