import User from "../models/user-entity";

export default interface IUsersRepository {
  findByEmail(email: string): Promise<User | undefined>;
  create(data: User): Promise<User>;
  save(user: User): Promise<User>;
  removeLast(): Promise<void>;
}
