import "server-only";

import { cookies } from "next/headers";

export async function createSession(bearerToken: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const cookieStore = await cookies();

  cookieStore.set("token", bearerToken, {
    httpOnly: true,
    secure: false,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();

  cookieStore.delete("token");
}
