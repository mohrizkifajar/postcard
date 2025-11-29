import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { Post, User } from "./definitions";

export const verifySession = cache(async () => {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  return { isAuth: true, bearerToken: token };
});

export const me = async (): Promise<User | undefined> => {
  const session = await verifySession();

  let ok = true;
  let data = [];

  try {
    const response = await fetch(`${process.env.API_URL}/me`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${session.bearerToken}`,
      },
      cache: "force-cache",
      next: { tags: ["me"] },
    });

    if (!response.ok) {
      ok = false;
    }

    data = await response.json();
  } catch (error) {
    console.error(error);
  }

  if (ok) {
    return data.data;
  }
};

export async function getFeeds(): Promise<Post[] | undefined> {
  const session = await verifySession();

  let ok = true;
  let data = null;

  try {
    const response = await fetch(`${process.env.API_URL}/feeds`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${session.bearerToken}`,
      },
      cache: "force-cache",
      next: { tags: ["feeds"] },
    });

    if (!response.ok) {
      ok = false;
    }

    data = await response.json();
  } catch (error) {
    console.error(error);
  }

  if (ok) {
    return data.data;
  }
}
