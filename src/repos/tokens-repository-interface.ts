import Token from "../models/token-entity";
import User from "../models/user-entity";

export default interface ITokenRepository {
  generate(user: User): Promise<void>;
  findByToken(token: string): Promise<Token | undefined>;
}
