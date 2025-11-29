"use server";

import { isAxiosError } from "axios";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";
import { api } from "@/lib/api";
import { verifySession } from "@/lib/dal";
import { createSession, deleteSession } from "@/lib/session";

const loginSchema = z.object({
  identity: z.string().min(1),
  otp_code: z.string().min(1),
});

export async function login(data: unknown) {
  const result = loginSchema.safeParse(data);

  if (!result.success) {
    return "Invalid input";
  }

  try {
    const response = await api.post("/auth/verify", result.data);

    await createSession(response.data.data.token);
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(error.response?.data);
    }

    console.error(error);
  }

  redirect("/");
}

export async function logout() {
  try {
    const session = await verifySession();

    await api.delete("/auth/logout", {
      headers: {
        Authorization: `Bearer ${session.bearerToken}`,
      },
    });

    await deleteSession();
  } catch (_error) {
    redirect("/login");
  }

  revalidateTag("me", "max");

  redirect("/login");
}
