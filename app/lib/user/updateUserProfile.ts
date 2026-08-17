import { getDataSource } from "../../api/data-source";
import { User } from "../../api/entities/User";
import { HTTPException } from "hono/http-exception";

export async function updateUserProfile(id: number, data: Partial<User>) {
  const dataSource = await getDataSource();
  const userRepository = dataSource.getRepository<User>("User");
  const user = await userRepository.findOneBy({ id });
  if (!user) {
    throw new HTTPException(404, { message: 'User not found' });
  }

  Object.assign(user, data);
  await userRepository.save(user);

  return user;
}