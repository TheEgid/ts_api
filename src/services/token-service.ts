import { getConnection } from "typeorm";
import User from "../models/user-entity";
import TokenRepository from "../repos/tokens-repository";

export default class TokenService {
  static async getUserByToken(refreshToken: string): Promise<User> {
    return await getConnection(process.env.DB_NAME)
      .getRepository(User)
      .createQueryBuilder("user")
      .leftJoinAndSelect("token", "token", "token.id = user.tokenId")
      .where("token.refreshToken = :1", { 1: refreshToken })
      .getOne();
  }

  static async setToken(user: User): Promise<User> {
    const token: TokenRepository = new TokenRepository();
    user.token = await token.generate();
    return user;
  }
}
