import dotenv from "dotenv";
import { Express } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import httpContext from "express-http-context";
import config from "config";
import { OpenAPIV2 } from "openapi-types";
import expressOasGenerator, { SPEC_OUTPUT_FILE_BEHAVIOR } from "express-oas-generator";
import createHealthcheckMiddleware from "healthcheck-ping";
import * as fs from "fs";
import UserController from "./controller/user-controller";
import SimpleController from "./controller/simple-controller";
import { createExpressServer } from "routing-controllers";
import { authorizationChecker } from "./auth/authorization-checker";
import dbConnect from "./database/database-connect";

dotenv.config();

const app = createExpressServer({
  authorizationChecker: authorizationChecker,

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
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: process.env.CORS_METHODS,
    preflightContinue: false,
    optionsSuccessStatus: process.env.CORS_OPTIONS_SUCCESS_STATUS,
  },
}) as Express;

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

app.use(bodyParser.json());

app.use(httpContext.middleware);
app.use(httpContext.middleware);
app.use(createHealthcheckMiddleware("api/status"));

expressOasGenerator.handleRequests();

// app.use((req, res, next) => {
//   httpContext.ns.bindEmitter(req);
//   httpContext.ns.bindEmitter(res);
//   next();
// });

dbConnect
  .getConnection()
  .then(() => {
    console.log("⛏ [database]: Postgres is running");
  })
  .catch((error) => {
    console.log("🚧 [database] Postgres Error: ".concat(error as string));
  });

const port: number = config.get("PORT");

const server = app.listen(port, () => console.log(`Running on port ${port}`));

export default server;
