"use server";

import { revalidateTag } from "next/cache";
import { api } from "@/lib/api";
import type { ToggleLikeResponse } from "@/lib/definitions";

export async function toggleLike(
  _initialState: ToggleLikeResponse,
  formData: FormData,
): Promise<ToggleLikeResponse> {
  let data = null;

  try {
    const response = await api.post(
      `/posts/${formData.get("post_id")}/likes`,
      {},
      {
        headers: {
          Authorization:
            "Bearer 1|iayTVN5CxElVsRxEvpJaIlAQdOJw3pzvm56bSD7P7779fbf1",
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
