// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getConnection } from "typeorm";
import User from "../models/user-entity";

import TokenRepository from "../repos/tokens-repository";
import UsersRepository from "../repos/users-repository";

// import { IPingResult, ping } from "@network-utils/tcp-ping";

export default class UserService {
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
    // Проверяем на совпадение email (Чтобы не было 2 пользователя с одним email)
    const userRepeat = await usersRepository.findByEmail(newUser.email);

    if (!userRepeat) {
      // Создаем токен
      newUser = await UserService.setToken(newUser);
      await usersRepository.save(newUser);
      return newUser.token.accessToken;
    } else {
      return process.env.USER_SERVICE_RESPONSE;
    }
  }

  // async getUserInfo(req: express.Request): Promise<User> {
  //   // Создаем Mongo repository
  //   const repository = getMongoRepository(User);
  //   // Поиск по текущему токену
  //   const user = await this.findUser(req, repository);
  //   return user;
  // }
  //
  // private async findUser(req: express.Request, repository: MongoRepository<User>): Promise<User> {
  //   if (req.get(process.env.HEADER_AUTH)) {
  //     // Получаем токен
  //     const token = req.get(process.env.HEADER_AUTH).split(" ", 2);
  //     const usersAll = await repository.find();
  //     // Ищем пользователя
  //     for (let i = 0; i < usersAll.length; i++) {
  //       if (usersAll[i].token.accessToken.toString() === token[1]) {
  //         return usersAll[i];
  //       }
  //     }
  //   }
  // }
  //
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

  private static async setToken(user: User): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const token: TokenRepository = new TokenRepository();
    user.token = await token.generate();
    // user.token = new Token();
    // user.token.accessToken = uuid();
    // user.token.refreshToken = uuid();
    // user.token.timeKill =
    //   Date.now() + Number(process.env.TO_SECONDS) * Number(process.env.TO_MINUTES);

    return user;
  }
}