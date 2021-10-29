import dotenv from "dotenv";
import express, { Express, RequestHandler } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import httpContext from "express-http-context";
import { useExpressServer } from "routing-controllers";
import cors from "cors";
import config from "config";
import expressOasGenerator from "express-oas-generator";
import * as fs from "fs";
import GlobalErrorHandler from "./middleware/global-error-handler";
import UserController from "./controller/user-controller";
import SimpleController from "./controller/simple-controller";
import DatabaseConnectionFacade from "./database/database-connection";

dotenv.config();

const app: Express = express();

const openAPIFilePath = "src/swagger/swagger.json";

const redefinedSpec: JSON = JSON.parse(fs.readFileSync(openAPIFilePath, { encoding: "utf-8" }));

expressOasGenerator.handleResponses(app, {
  specOutputFileBehavior: undefined,
  swaggerDocumentOptions: undefined,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  predefinedSpec: redefinedSpec,
  specOutputPath: openAPIFilePath,
  writeIntervalMs: 100,
});

// setup the logger
app.use(morgan("dev"));

// const port = process.env.PORT;
const port: number = config.get("PORT");

app.get("/data", (req, res) => {
  const data = {
    id: 1,
    name: "unknown",
    activated: true,
  };
  return res.status(200).send(data);
});

app.use(cors() as RequestHandler);
app.use(bodyParser.json());
app.use(httpContext.middleware);
useExpressServer(app, {
  controllers: [UserController, SimpleController], // we specify controllers we want to use
  middlewares: [GlobalErrorHandler],
  defaultErrorHandler: false,
});

expressOasGenerator.handleRequests();

// app.use((req, res, next) => {
//   httpContext.ns.bindEmitter(req);
//   httpContext.ns.bindEmitter(res);
//   next();
// });

DatabaseConnectionFacade.multipleConnections()
  .then(() => {
    console.log("⛏ [database]: Postgres is running");
  })
  .catch((error) => {
    console.log("🚧 [database] Postgres Error: ".concat(error as string));
  });

app.listen(port, () => console.log(`↯ [server]: Server is running at http://localhost:${port}`));
