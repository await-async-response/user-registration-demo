import { getDataSource } from '../../db/getDataSource';
import { User } from "../../api/entities/User";

export async function getUserProfile(id: number) {
  const dataSource = await getDataSource();
  const userRepository = dataSource.getRepository<User>("users");
  // Return null rather than throwing: a valid JWT can still point to a user
  // that no longer exists (e.g. the database was reset), which callers should
  // treat as an invalid session rather than a hard error.
  return userRepository.findOneBy({ id });
}