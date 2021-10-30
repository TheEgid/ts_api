import Token from "../models/token-entity";

export default interface ITokenRepository {
  generate(userId: string): Promise<Token>;
  findByToken(token: string): Promise<Token | undefined>;
}
