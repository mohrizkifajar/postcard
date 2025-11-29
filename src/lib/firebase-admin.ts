import * as admin from "firebase-admin";

const serviceAccount = require("./zeno-476113-firebase-adminsdk-fbsvc-64a1bdf3d7.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://zeno-476113.firebaseio.com",
  });
}

export { admin };
