import { cookies } from "next/headers";
import { verify } from "hono/jwt";
import { AUTH_COOKIE_NAME } from "../api/auth";

export type AuthPayload = {
  sub: string;
  email: string;
  exp: number;
};

export async function getAuthPayload(): Promise<AuthPayload | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    return (await verify(token, secret, "HS256")) as AuthPayload;
  } catch {
    return null;
  }
}
