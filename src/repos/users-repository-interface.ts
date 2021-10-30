import User from "../models/user-entity";

export default interface IUsersRepository {
  findById(id: number): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: User): Promise<User>;
  save(user: User): Promise<User>;
  remove(id: number): Promise<void>;
}
