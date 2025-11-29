// import { getAnalytics } from "firebase/analytics";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDhybTaR2xas1bC7t-dDGEQdgKCFYUzYo0",
  authDomain: "zeno-476113.firebaseapp.com",
  projectId: "zeno-476113",
  storageBucket: "zeno-476113.firebasestorage.app",
  messagingSenderId: "374377572527",
  appId: "1:374377572527:web:c7aed4e905c11798a88c5a",
  measurementId: "G-34FHNK14NB",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);
const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

export const getMessagingToken = async () => {
  let currentToken = "";

  if (!messaging) {
    return "";
  }

  try {
    currentToken = await getToken(messaging, {
      vapidKey:
        "BKiF8zYlkHn5cOzQLdo4Uk9WtHnTtJUfG4yLsBeL2cQHFl9RHbwuS0jnIH6dXKg2t03YHp_6HBTGEBOHvw7xP7M",
    });
  } catch (error) {
    console.log("An error occurred while retrieving token. ", error);
  }
  return currentToken;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    }
  });
