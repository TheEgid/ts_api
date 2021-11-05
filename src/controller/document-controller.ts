import * as path from "path";
import fileProcess from "../services/document-service";
import { JsonController, Get, OnUndefined } from "routing-controllers";

import { StatusCodes } from "http-status-codes";

const pdfFilepath = path.join(__dirname, "../..", "UPLOAD", "Resh1.pdf");

@JsonController()
export default class DocumentController {
  @Get("/document")
  @OnUndefined(StatusCodes.BAD_REQUEST)
  public async getDocument() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
    const processed = await fileProcess(pdfFilepath);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
    return JSON.parse(processed.stdout);
  }
}
