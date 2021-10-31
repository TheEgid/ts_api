import { Action, UnauthorizedError } from "routing-controllers";
import { getMongoRepository } from "typeorm";

import User from "../models/user-entity";

export async function authorizationChecker(action: Action): Promise<boolean> {
  let token: string;

  // https://github.com/sc372/simple-blog-app-react-node/blob/6039a6716233219d4d043742702a9eb1d8999506/backend/src/helpers/current_user_checker.helper.ts
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (action.request.headers.authorization) {
    // Получаем текущий токен
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    token = action.request.headers.authorization.split(" ", 2);
    const repository = getMongoRepository(User);
    const usersAll = await repository.find();

    for (let i = 0; i < usersAll.length; i++) {
      if (usersAll[i].token.accessToken.toString() === token[1]) {
        return true;
      }
    }
  } else {
    throw new UnauthorizedError("This user has not token.");
  }
  return false;
}
