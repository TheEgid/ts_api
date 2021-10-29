import Photo from "../models/photo-entity";
import User from "../models/user-entity";
import { Connection } from "typeorm";

export default class Postgres extends Connection {
  static getConnection(): {
    name: string;
    type: string;
    url: string;
    synchronize: boolean;
    logging: boolean;
    entities: Array<unknown>;
  } {
    return {
      entities: [Photo, User],
      synchronize: true,
      name: process.env.DB_NAME,
      type: "postgres",
      logging: true,
      url: process.env.DEV_DATABASE_URL,
    };
  }
}
