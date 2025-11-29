"use server";

import { api } from "@/lib/api";
import { verifySession } from "@/lib/dal";
import { admin } from "@/lib/firebase-admin";

export async function sendNotification(
  token: string,
  title: string,
  body: string,
) {
  const message = {
    token: token,
    notification: {
      title,
      body,
    },
  };

  try {
    const response = await admin.messaging().send(message);

    console.log("Successfully sent message:", response);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

export async function sendTokenToServer(token: string) {
  const session = await verifySession();

  try {
    const response = await api.post(
      "/notification-tokens",
      {
        token,
      },
      {
        headers: {
          Authorization: `Bearer ${session.bearerToken}`,
        },
      },
    );

    if (response.status === 204) {
      //
    }
  } catch (error) {
    console.error(error);
  }
}
