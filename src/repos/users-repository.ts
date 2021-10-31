import { Repository, EntityRepository, getConnection } from "typeorm";
import IUsersRepository from "./users-repository-interface";
import User from "../models/user-entity";

@EntityRepository(User)
class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getConnection(process.env.DB_NAME).getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    return await this.ormRepository.findOne(id);
  }

  public async findByEmailHashedPassword(email: string, hashedPassword: string): Promise<User> {
    return await this.ormRepository.findOne({
      where: { email, hashedPassword },
      withDeleted: false,
    });
  }

  public async findAll(): Promise<User[]> {
    return await this.ormRepository.find();
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return await this.ormRepository.findOne({
      where: { email },
      withDeleted: false,
    });
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async create(userData: User): Promise<User> {
    const user = this.ormRepository.create(userData);
    await this.ormRepository.save(user);
    return user;
  }

  public async remove(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default UsersRepository;
