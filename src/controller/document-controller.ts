import path from "path";
import multer from "multer";
import shortHash from "shorthash2";
import { Get, JsonController, OnUndefined, Post, UploadedFile } from "routing-controllers";
import { StatusCodes } from "http-status-codes";
import fileProcess from "../services/document-service";

const getOptions = multer({
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, "../../UPLOAD/"),
    filename: (req, file, cb) => {
      const newName = [shortHash(file.originalname), ".pdf"].join("");
      cb(null, newName);
    },
  }),
  limits: {
    fileSize: 10485760, // 10 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype === "application/x-pdf") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("only .pdf format allowed!"));
    }
  },
});

const pdfFilepath = path.join(__dirname, "../..", "UPLOAD", "Resh1.pdf");

@JsonController()
export default class DocumentController {
  @Get("/document")
  @OnUndefined(StatusCodes.BAD_REQUEST)
  public async getDocument() {
    const processed = await fileProcess(pdfFilepath);
    return JSON.parse(processed.stdout) as string;
  }

  @Post("/upload")
  @OnUndefined(StatusCodes.UNPROCESSABLE_ENTITY)
  public async uploadDocument(
    @UploadedFile("customfile", { options: getOptions }) file: Express.Multer.File
  ) {
    const processed = await fileProcess(file.path);
    return JSON.parse(processed.stdout) as string;
  }
}
