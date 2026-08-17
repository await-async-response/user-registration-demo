export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { getDataSource } = await import("./app/api/data-source");
    await getDataSource();
  }
}
