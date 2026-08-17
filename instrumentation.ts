export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { getDataSource } = await import("./app/db/getDataSource");
    await getDataSource();
  }
}
