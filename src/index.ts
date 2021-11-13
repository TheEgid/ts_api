import dotenv from "dotenv";
import { Express } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import httpContext from "express-http-context";
import createHealthcheckMiddleware from "healthcheck-ping";
import UserController from "./controller/user-controller";
import SimpleController from "./controller/simple-controller";
import DocumentController from "./controller/document-controller";
import { createExpressServer } from "routing-controllers";
import { authorizationChecker } from "./auth/authorization-checker";
import dbConnect from "./database/database-connect";

dotenv.config();

const app = createExpressServer({
  authorizationChecker: authorizationChecker,

  routePrefix: process.env.SERVER_PREFIX,

  defaults: {
    nullResultCode: Number(process.env.ERROR_NULL_RESULT_CODE),
    undefinedResultCode: Number(process.env.ERROR_NULL_UNDEFINED_RESULT_CODE),
    paramOptions: {
      required: true,
    },
  },

  controllers: [UserController, SimpleController, DocumentController],
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: process.env.CORS_METHODS,
    preflightContinue: false,
    optionsSuccessStatus: process.env.CORS_OPTIONS_SUCCESS_STATUS,
  },
}) as Express;

app.use(morgan("dev"));
app.use(bodyParser.json());

app.use(httpContext.middleware);
app.use(createHealthcheckMiddleware("api/status"));

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
  })
  .finally(() => console.log(`⚙ [${process.env.APP_ENV}]: environment`));

const port = process.env.SERVER_PORT as unknown as number;

const server = app.listen(port, () => console.log(`Running on port ${port}`));

export default server;
