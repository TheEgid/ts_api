import { getConnection } from "typeorm";
import User from "../models/user-entity";
import UsersRepository from "../repos/users-repository";

class ListUserService {
  public async execute(): Promise<User[]> {
    const usersRepository = getConnection(process.env.DB_NAME).getCustomRepository(UsersRepository);
    return await usersRepository.findAll();
  }
}

export default ListUserService;
