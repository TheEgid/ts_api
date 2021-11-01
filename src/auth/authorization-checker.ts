import { Action, UnauthorizedError } from "routing-controllers";
import TokenService from "../services/token-service";

// interface ResponseHeaders {
//   "content-type": string;
//   ["token": string]: string; // you could set more explicit headers names or even remove the above and set just this line
// }

export async function authorizationChecker(action: Action): Promise<boolean> {
  // https://github.com/sc372/simple-blog-app-react-node/blob/6039a6716233219d4d043742702a9eb1d8999506/backend/src/helpers/current_user_checker.helper.ts
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (action.request.headers.authorization) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const [, token] = action.request.headers.authorization.split(" ", 2);
    const curUser = await TokenService.getUserByToken(token as string);
    if (curUser !== undefined) {
      return true;
    }
  } else {
    throw new UnauthorizedError("No token.");
  }
  return false;
}
