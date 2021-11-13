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
    };

    let configConnection = {};

    switch (process.env.APP_ENV) {
      case "test": {
        process.env.DB_NAME = process.env.DB_NAME_TEST;
        configConnection = {
          name: process.env.DB_NAME_TEST,
          url: process.env.DB_URL_TEST,
        };
        break;
      }
      case "dev": {
        process.env.DB_NAME = process.env.DB_NAME_DEV;
        configConnection = {
          name: process.env.DB_NAME_DEV,
          url: process.env.DB_URL_DEV,
        };
        break;
      }
      case "prod": {
        process.env.DB_NAME = process.env.DB_NAME_PROD;
        configConnection = {
          name: process.env.DB_NAME_PROD,
          url: process.env.DB_URL_PROD,
        };
        break;
      }
    }
    Object.assign(connectionOptions, configConnection);

    return await createConnection(connectionOptions);
  }

  public async closeConnection(): Promise<void> {
    await getConnection(process.env.DB_NAME).close();
  }
}

const dbConnect: DatabaseConnect = new DatabaseConnect();

export default dbConnect;
