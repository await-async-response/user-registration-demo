import "reflect-metadata";
import { DataSource } from "typeorm";
import * as mysql2 from "mysql2";
import { User } from "../api/entities/User";

export const AppDataSource = new DataSource({
    type: "mysql",
    // Pass the driver module explicitly so TypeORM doesn't dynamically
    // `require("mysql2")` at runtime, which Turbopack's bundle can't resolve.
    driver: mysql2,
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    username: process.env.DB_USER || "app",
    password: process.env.DB_PASSWORD || "app_password",
    database: process.env.DB_NAME || "app",
    synchronize: true,
    logging: true,
    entities: [User],
    subscribers: [],
    migrations: [],
});