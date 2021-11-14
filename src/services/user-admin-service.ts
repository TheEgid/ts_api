import { getConnection } from "typeorm";
import User from "../models/user-entity";
import UsersRepository from "../repos/users-repository";

export default class UserAdminService {
  static async getUsers(): Promise<User[]> {
    return await getConnection(process.env.DB_NAME).getCustomRepository(UsersRepository).findAll();
  }
}
