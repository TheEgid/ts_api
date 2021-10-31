import dotenv from "dotenv";
import { Express } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import httpContext from "express-http-context";
import config from "config";
import { OpenAPIV2 } from "openapi-types";
import expressOasGenerator, { SPEC_OUTPUT_FILE_BEHAVIOR } from "express-oas-generator";
import * as fs from "fs";
import UserController from "./controller/user-controller";
import SimpleController from "./controller/simple-controller";
import DatabaseConnectionFacade from "./database/database-connection";
import { createExpressServer } from "routing-controllers";

dotenv.config();

DatabaseConnectionFacade.multipleConnections()
  .then(() => {
    console.log("⛏ [database]: Postgres is running");
  })
  .catch((error) => {
    console.log("🚧 [database] Postgres Error: ".concat(error as string));
  });

// Создаем приложение Express
const app = createExpressServer({
  // Префикс
  routePrefix: process.env.SERVER_PREFIX,
  // Инициализируем ошибки
  defaults: {
    nullResultCode: Number(process.env.ERROR_NULL_RESULT_CODE),
    undefinedResultCode: Number(process.env.ERROR_NULL_UNDEFINED_RESULT_CODE),
    paramOptions: {
      required: true,
    },
  },

  controllers: [UserController, SimpleController],
  // authorizationChecker: authorizationChecker,
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: process.env.CORS_METHODS,
    preflightContinue: false,
    optionsSuccessStatus: process.env.CORS_OPTIONS_SUCCESS_STATUS,
  },
}) as Express;

// const app: Express = express();

const openAPIFilePath = "src/swagger/swagger.json";

const redefinedSpec = JSON.parse(
  fs.readFileSync(openAPIFilePath, { encoding: "utf-8" })
) as OpenAPIV2.Document;

expressOasGenerator.handleResponses(app, {
  predefinedSpec: redefinedSpec,
  specOutputPath: openAPIFilePath,
  writeIntervalMs: 100,
  specOutputFileBehavior: SPEC_OUTPUT_FILE_BEHAVIOR.RECREATE,
  alwaysServeDocs: false,
  swaggerDocumentOptions: { customCss: ".swagger-ui .info .title { color: #89bf04 }" },
});

// setup the logger
app.use(morgan("dev"));

const port: number = config.get("PORT");
app.use(bodyParser.json());
app.use(httpContext.middleware);

expressOasGenerator.handleRequests();

// app.use((req, res, next) => {
//   httpContext.ns.bindEmitter(req);
//   httpContext.ns.bindEmitter(res);
//   next();
// });

app.listen(port, () => console.log(`↯ [server]: Server is running at http://localhost:${port}`));
