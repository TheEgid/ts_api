import { getConnection } from "typeorm";
import User from "../models/user-entity";
import Token from "../models/token-entity";
import TokenRepository from "../repos/tokens-repository";

export default class TokenService {
  static async getUserByToken(refreshToken: string): Promise<User> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-return
    return await getConnection(process.env.DB_NAME)
      .getRepository(Token)
      .query(
        `SELECT * FROM "user", "token" where "token".id = "user"."tokenId" and "token"."refreshToken" = $1`,
        [refreshToken]
      );
  }

  static async setToken(user: User): Promise<User> {
    const token: TokenRepository = new TokenRepository(); // CH to service
    user.token = await token.generate();
    return user;
  }
}
