import { EntityRepository, getConnection, Repository } from "typeorm";
import argon2 from "argon2";
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
    const user = await this.findByEmail(email);
    const valid = await argon2.verify(user.hashedPassword, hashedPassword);
    if (valid === false) {
      return undefined;
    }
    return await this.ormRepository.findOne({
      where: { email },
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
    if (user.hashedPassword.startsWith("$argon2i$v=19$m=4096,t=3,p=1$") === false) {
      user.hashedPassword = await argon2.hash(user.hashedPassword);
    }
    return await this.ormRepository.save(user);
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

// https://temofeev.ru/info/articles/rukovodstvo-po-autentifikatsii-v-node-js-bez-passport-js-i-storonnikh-servisov/
