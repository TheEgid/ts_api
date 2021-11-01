import { getConnection } from "typeorm";
import User from "../models/user-entity";
import Token from "../models/token-entity";

export default class TokenService {
  static async getUserByToken(accessToken: string): Promise<User> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-return
    return await getConnection(process.env.DB_NAME)
      .getRepository(Token)
      .query(
        `SELECT * FROM "user", "token" where "token".id = "user"."tokenId" and "token"."accessToken" = $1`,
        [accessToken]
      );
  }
}
