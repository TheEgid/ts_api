import Photo from "../models/photo-entity";

export default class Postgres {
  static getConnection(): {
    name: string;
    type: string;
    url: string;
    synchronize: boolean;
    logging: boolean;
    entities: Array<unknown>;
  } {
    return {
      entities: [Photo],
      synchronize: true,
      name: process.env.DB_NAME,
      type: "postgres",
      logging: false,
      url: process.env.DEV_DATABASE_URL,
    };
  }
}
