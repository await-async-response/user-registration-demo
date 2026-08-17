import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "app",
    password: "app_password",
    database: "app",
    synchronize: true,
    logging: true,
    entities: [User],
    subscribers: [],
    migrations: [],
});