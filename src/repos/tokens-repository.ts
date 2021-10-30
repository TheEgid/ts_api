import { Repository, getConnection } from "typeorm";

import ITokenRepository from "./tokens-repository-interface";
import Token from "../models/token-entity";

class TokenRepository implements ITokenRepository {
  private ormRepository: Repository<Token>;

  constructor() {
    this.ormRepository = getConnection(process.env.DB_NAME).getRepository(Token);
  }

  public async generate(userId: string): Promise<Token> {
    const Token = this.ormRepository.create({
      userId,
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
