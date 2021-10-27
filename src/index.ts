import dotenv from 'dotenv';
import express, { Express, RequestHandler } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import httpContext from 'express-http-context';
import { useExpressServer } from 'routing-controllers';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import config from 'config';
import * as swaggerDocument from './swagger/openapi.json';
import GlobalErrorHandler from './middleware/global-error-handler';
import UserController from './controller/user-controller';
import SimpleController from './controller/simple-controller';

dotenv.config();

const app: Express = express();

// setup the logger
app.use(morgan('dev'));

// const port = process.env.PORT;
const port: number = config.get('PORT');

app.use(cors() as RequestHandler);
app.use(bodyParser.json());
app.use(httpContext.middleware);
useExpressServer(app, {
  controllers: [UserController, SimpleController], // we specify controllers we want to use
  middlewares: [GlobalErrorHandler],
  defaultErrorHandler: false,
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.use((req, res, next) => {
//   httpContext.ns.bindEmitter(req);
//   httpContext.ns.bindEmitter(res);
//   next();
// });

app.listen(port, () => console.log(`⚡️[server]: Server is running at http://localhost:${port}`));
