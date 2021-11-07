import { getConnection } from "typeorm";
import User from "../models/user-entity";
import TokenRepository from "../repos/tokens-repository";

export default class TokenService {
  static async getUserByToken(accessToken: string): Promise<User> | undefined {
    return await getConnection(process.env.DB_NAME)
      .getRepository(User)
      .createQueryBuilder("user")
      .leftJoinAndSelect("token", "token", "token.id = user.tokenId")
      .where("token.accessToken = :1", { 1: accessToken })
      .getOne();
  }

  static async setToken(user: User): Promise<User> {
    const token: TokenRepository = new TokenRepository(); // CH to service
    user.token = await token.generate();
    return user;
  }
}
