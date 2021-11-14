import { HttpError } from "routing-controllers";

export default class ControllerError extends HttpError {
  public errorCode: number;
  public operationName: string;

  constructor(errorCode: number, operationName: string) {
    super(errorCode);
    Object.setPrototypeOf(this, ControllerError.prototype);
    this.errorCode = errorCode;
    this.operationName = operationName;
  }

  toJSON() {
    return {
      status: this.errorCode,
      failedOperation: this.operationName,
    };
  }
}
