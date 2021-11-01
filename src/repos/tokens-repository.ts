import { Repository, getConnection } from "typeorm";
import { v4 as uuid } from "uuid";
import ITokenRepository from "./tokens-repository-interface";
import Token from "../models/token-entity";

// function addDays(days: number): Date {
//   const date = new Date(Date.now());
//   date.setDate(date.getDate() + days);
//   return date;
// }

class TokenRepository implements ITokenRepository {
  private ormRepository: Repository<Token>;

  constructor() {
    this.ormRepository = getConnection(process.env.DB_NAME).getRepository(Token);
  }

  public async generate(): Promise<Token> {
    const timekiller = new Date(
      Date.now() + Number(process.env.TO_SECONDS) * Number(process.env.TO_MINUTES)
    ).toISOString();
    const Token = this.ormRepository.create({
      accessToken: uuid(),
      refreshToken: uuid(),
      timeKill: timekiller,
    });
    await this.ormRepository.save(Token);
    return Token;
  }

  public async findByToken(token: string): Promise<Token | undefined> {
    return await this.ormRepository.findOne({
      where: { token },
    });
  }
}

export default TokenRepository;
