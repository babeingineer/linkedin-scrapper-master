import { DataSource } from "typeorm";
import { Profile } from "./entity/Profile";
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_TYPE,
  DB_USERNAME,
} from "./config";
import { User } from "./entity/User";

export const AppDataSouce = new DataSource({
  type: DB_TYPE as "postgres",
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  entities: [Profile, User],
  synchronize: true,
  logging: false,
});
