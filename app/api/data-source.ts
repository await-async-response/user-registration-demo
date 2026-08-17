import "reflect-metadata";
import { DataSource } from "typeorm";
import * as mysql2 from "mysql2";
import { User } from "./entities/User";

function createDataSource() {
    return new DataSource({
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
}

// Next.js compiles route handlers and Server Components into separate module
// graphs, each getting its own copy of this module. Caching on `globalThis`
// (same trick used for Prisma clients in Next.js) ensures every copy shares
// the same underlying connection and init promise instead of each opening
// its own, uninitialized DataSource.
const globalForDataSource = globalThis as unknown as {
    dataSource?: DataSource;
    dataSourceInit?: Promise<DataSource>;
};

const AppDataSource = globalForDataSource.dataSource ?? createDataSource();
globalForDataSource.dataSource = AppDataSource;

export function getDataSource(): Promise<DataSource> {
    if (AppDataSource.isInitialized) {
        return Promise.resolve(AppDataSource);
    }
    if (!globalForDataSource.dataSourceInit) {
        globalForDataSource.dataSourceInit = AppDataSource.initialize().catch((error) => {
            globalForDataSource.dataSourceInit = undefined;
            throw error;
        });
    }
    return globalForDataSource.dataSourceInit;
}