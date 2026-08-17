import { AppDataSource } from "./data-source";

let initialization: Promise<typeof AppDataSource> | null = null;

export function getDataSource() {
  if (AppDataSource.isInitialized) {
    return Promise.resolve(AppDataSource);
  }

  if (!initialization) {
    initialization = AppDataSource.initialize();
  }

  return initialization;
}