import { getConnection } from "typeorm";
import User from "../models/user-entity";
import { Request } from "express";
import UsersRepository from "../repos/users-repository";
import TokenService from "./token-service";
import { IPingResult, ping } from "@network-utils/tcp-ping";
import { Unauthorized, NotAcceptable } from "http-json-errors";
import TokenRepository from "../repos/tokens-repository";

export default class UserService {
  static async getUsers(): Promise<User[]> {
    return await getConnection(process.env.DB_NAME).getCustomRepository(UsersRepository).findAll();
  }

  // Регистрация пользователя
  async userSignup(newUser: User): Promise<string | Error> {
    const usersRepository = getConnection(process.env.DB_NAME).getCustomRepository(UsersRepository);
    const userRepeat = await usersRepository.findByEmail(newUser.email);
    if (!(userRepeat instanceof User)) {
      newUser = await TokenService.setToken(newUser);
      await usersRepository.save(newUser);
      return newUser.token.refreshToken;
    } else {
      throw new NotAcceptable(`Already logged as ${newUser.email}`);
    }
  }

  async userSignin(user: User): Promise<string | Error> {
    const usersRepository = getConnection(process.env.DB_NAME).getCustomRepository(UsersRepository);
    let oldUser = await usersRepository.findByEmailHashedPassword(user.email, user.hashedPassword);
    if (oldUser instanceof User) {
      oldUser = await TokenService.setToken(oldUser);
      await usersRepository.save(oldUser);
      return oldUser.token.refreshToken;
    } else {
      throw new Unauthorized("Wrong Password or Username");
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

  async userLogout(req: Request): Promise<void> {
    const TokenRepo = getConnection(process.env.DB_NAME).getCustomRepository(TokenRepository);
    if (req.get(process.env.HEADER_AUTH)) {
      const [, token] = req.headers.authorization.split(" ", 2);
      await TokenRepo.remove(token);
    }
  }

  async deleteLastUser(): Promise<void> {
    const UserRepo = getConnection(process.env.DB_NAME).getCustomRepository(UsersRepository);
    await UserRepo.removeLast();
  }
}

// const usersRepository = getConnection(process.env.DB_NAME).getCustomRepository(UsersRepository);
// if (req.get(process.env.HEADER_AUTH)) {
// const [, token] = req.headers.authorization.split(" ", 2);
// const curUser = await usersRepository.findByToken(token);
// await usersRepository.remove(curUser);

// const repository = getMongoRepository(User);
// // Поиск по текущему токену
// const user = await this.findUser(req, repository);
//
// if (all) {
//   // Если true удаляем(заменяем пустыми, что тоже так себе. Опять же тупо с Mongo не очень удобно работать, так проще всего было. Так метод Update юзал) все токены
//   user.token.accessToken = process.env.GET_LOGOUT_TOKEN;
//   user.token.refreshToken = process.env.GET_LOGOUT_TOKEN;
//   return await TokenService.getUserByToken(token);
//   // repository.save(user);
// } else {
//   // Если false удаляем только текущий
//   user.token.accessToken = process.env.GET_LOGOUT_TOKEN;
//   // Сохраняем изменения
//   repository.save(user);
// }
