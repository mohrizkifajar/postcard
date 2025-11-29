// Scripts for firebase and firebase messaging
importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js",
);

// Initialize the Firebase app in the service worker
// "Default" Firebase app (important for initialization)
firebase.initializeApp({
  apiKey: "AIzaSyDhybTaR2xas1bC7t-dDGEQdgKCFYUzYo0",
  authDomain: "zeno-476113.firebaseapp.com",
  projectId: "zeno-476113",
  storageBucket: "zeno-476113.firebasestorage.app",
  messagingSenderId: "374377572527",
  appId: "1:374377572527:web:c7aed4e905c11798a88c5a",
  measurementId: "G-34FHNK14NB",
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "./avatar.png",
  };

  // self.registration.showNotification(notificationTitle, notificationOptions);

  self.clients
    .matchAll({
      type: "window",
      includeUncontrolled: true,
    })
    .then((clients) => {
      if (clients && clients.length > 0) {
        // The app is in the foreground, don't show a notification
        return;
      }

      self.registration.showNotification(
        notificationTitle,
        notificationOptions,
      );
    });
});
