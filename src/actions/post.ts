"use server";

import { revalidateTag } from "next/cache";
import { api } from "@/lib/api";
import { verifySession } from "@/lib/dal";
import type { ToggleLikeResponse } from "@/lib/definitions";

export async function toggleLike(
  _initialState: ToggleLikeResponse,
  formData: FormData,
): Promise<ToggleLikeResponse> {
  const session = await verifySession();

  let data = null;

  try {
    const response = await api.post(
      `/posts/${formData.get("post_id")}/likes`,
      {},
      {
        headers: {
          Authorization: `Bearer ${session.bearerToken}`,
        },
      },
    );

    if (response.status === 202) {
      data = response.data.data;
    }
  } catch (error) {
    console.error(error);

    return {
      status: "failed",
      data,
    };
  }

  revalidateTag("feeds", "max");

  return {
    status: "success",
    data,
  };
}
