import { EntityRepository, getConnection, Repository } from "typeorm";
import { v4 as uuid } from "uuid";
import ITokenRepository from "./tokens-repository-interface";
import Token from "../models/token-entity";
import User from "../models/user-entity";

@EntityRepository(Token)
class TokenRepository implements ITokenRepository {
  private ormRepository: Repository<Token>;

  constructor() {
    this.ormRepository = getConnection(process.env.DB_NAME).getRepository(Token);
  }

  public async generate(user: User): Promise<void> {
    const addSomeDays = (days: number): string => {
      const current = new Date();
      return new Date(current.getTime() + 86400000 * days).toISOString(); // + days in ms
    };
    const Token = this.ormRepository.create({
      id: uuid(),
      accessToken: uuid(),
      refreshToken: uuid(),
      expiresIn: addSomeDays(2),
      userId: user,
    });
    await this.ormRepository.save(Token);
  }

  public async findByToken(token: string): Promise<Token | undefined> {
    return await this.ormRepository.findOne({
      where: { token },
    });
  }

  public async findAll(): Promise<Token[]> {
    return await this.ormRepository.find();
  }

  public async remove(token: string): Promise<void> {
    await this.ormRepository
      .createQueryBuilder()
      .update(Token)
      .set({ refreshToken: "" })
      .where("refreshToken = :refreshToken", { refreshToken: token })
      .execute();
  }
}
export default TokenRepository;
