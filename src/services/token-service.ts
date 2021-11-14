import { getConnection } from "typeorm";
import User from "../models/user-entity";
import TokenRepository from "../repos/tokens-repository";
import Token from "../models/token-entity";

export default class TokenService {
  static async getUserByToken(refreshToken: string): Promise<User> {
    return await getConnection(process.env.DB_NAME)
      .getRepository(User)
      .createQueryBuilder("user")
      .leftJoinAndSelect("token", "token", "token.userId = user.id")
      .where("token.refreshToken = :1", { 1: refreshToken })
      .getOne();
  }

  static async getTokenByUser(user: User): Promise<Token> {
    return await getConnection(process.env.DB_NAME)
      .getRepository(Token)
      .createQueryBuilder("token")
      .leftJoinAndSelect("user", "user", "token.userId = user.id")
      .where("user.id = :1", { 1: user.id })
      .orderBy("token.expiresIn", "DESC")
      .getOne();
  }

  static async setToken(user: User): Promise<void> {
    const oldToken = await this.getTokenByUser(user);
    if (!(oldToken instanceof Token && Date.now() - Date.parse(oldToken.expiresIn) < 0)) {
      const token: TokenRepository = new TokenRepository();
      await token.generate(user);
    }
  }
}
