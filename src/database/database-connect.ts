import {
  Connection,
  ConnectionManager,
  ConnectionOptions,
  createConnection,
  getConnectionManager,
  getConnection,
} from "typeorm";

import Photo from "../models/photo-entity";
import User from "../models/user-entity";
import UserToken from "../models/token-entity";

class DatabaseConnect {
  private connectionManager: ConnectionManager;

  constructor() {
    this.connectionManager = getConnectionManager();
  }

  public async getConnection() {
    let connection: Connection;

    if (this.connectionManager.has(process.env.DB_NAME)) {
      console.log(`Using existing connection ...`);

      connection = getConnection(process.env.DB_NAME);

      if (!connection.isConnected) {
        connection = await connection.connect();
      }
    } else {
      return await DatabaseConnect.createConnection();
    }

    return connection;
  }

  private static async createConnection() {
    console.log(`[ Creating connection ...`);

    const connectionOptions: ConnectionOptions = {
      entities: [Photo, User, UserToken],
      synchronize: true,
      type: "postgres",
      logging: true,
      name: process.env.DB_NAME,
      url: process.env.DEV_DATABASE_URL,
    };

    const configConnection = {};
    // // switch (process.env.APP_ENV) {
    // //     case 'stg': {
    // //         configConnection = {
    // //             host: process.env.TYPEORM_HOST_STG,
    // //             username: process.env.TYPEORM_USERNAME_STG,
    // //             database: process.env.TYPEORM_DATABASE_STG,
    // //             password: process.env.TYPEORM_PASSWORD_STG,
    // //         }
    // //         break
    // //     }
    // //     case 'dev': {
    // //         configConnection = {
    // //             host: process.env.TYPEORM_HOST_DEV,
    // //             username: process.env.TYPEORM_USERNAME_DEV,
    // //             database: process.env.TYPEORM_DATABASE_DEV,
    // //             password: process.env.TYPEORM_PASSWORD_DEV,
    // //         }
    // //         break
    // //     }
    // //     case 'prod': {
    // //         configConnection = {
    // //             host: process.env.TYPEORM_HOST_PROD,
    // //             username: process.env.TYPEORM_USERNAME_PROD,
    // //             database: process.env.TYPEORM_DATABASE_PROD,
    // //             password: process.env.TYPEORM_PASSWORD_PROD,
    // //         }
    // //         break
    // //     }
    // }
    Object.assign(connectionOptions, configConnection);

    return await createConnection(connectionOptions);
  }

  public async closeConnection(): Promise<void> {
    await getConnection(process.env.DB_NAME).close();
  }
}

const dbConnect: DatabaseConnect = new DatabaseConnect();

export default dbConnect;
