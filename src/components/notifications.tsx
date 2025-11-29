"use client";

import { Bell, Check, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { sendNotification, sendTokenToServer } from "@/actions/notification";
import type { Notification } from "@/lib/definitions";
import { getMessagingToken, onMessageListener } from "@/lib/firebase";

const groupNotificationsByDate = (notifications: Notification[]) => {
  const groups: { [key: string]: Notification[] } = {
    Today: [],
    Yesterday: [],
    Older: [],
  };

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  notifications.forEach((notif) => {
    const notifDate = new Date(notif.timestamp);
    if (notifDate.toDateString() === today.toDateString()) {
      groups.Today.push(notif);
    } else if (notifDate.toDateString() === yesterday.toDateString()) {
      groups.Yesterday.push(notif);
    } else {
      groups.Older.push(notif);
    }
  });

  return groups;
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isTokenFound, setTokenFound] = useState(false);
  const [token, setToken] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getMessagingToken();
      if (token) {
        setToken(token);
        setTokenFound(true);
        sendTokenToServer(token);
      }
    };
    fetchToken();
  }, []);

  onMessageListener()
    .then((payload: any) => {
      setNotifications((prev) => [
        ...prev,
        {
          id: payload.messageId,
          title: payload.notification.title,
          body: payload.notification.body,
          read: false,
          timestamp: new Date(),
        },
      ]);
    })
    .catch((err) => console.log("failed: ", err));

  const handleSendNotification = async () => {
    if (isTokenFound && token) {
      await sendNotification(token, "Hello", "This is a test notification");
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((notif) => !notif.read).length;
  const groupedNotifications = groupNotificationsByDate(notifications);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 bg-white rounded-full hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 max-h-[70vh] overflow-y-auto bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications
            </h3>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Mark all as read
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="p-1 text-gray-400 rounded-full hover:bg-gray-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="py-1">
            {notifications.length > 0 ? (
              Object.keys(groupedNotifications).map(
                (group) =>
                  groupedNotifications[
                    group as keyof typeof groupedNotifications
                  ].length > 0 && (
                    <div key={group}>
                      <h4 className="px-4 py-2 text-sm font-medium text-gray-500">
                        {group}
                      </h4>
                      {groupedNotifications[
                        group as keyof typeof groupedNotifications
                      ].map((notif) => (
                        <div
                          key={notif.id}
                          className={`flex items-start px-4 py-3 transition-colors duration-150 hover:bg-gray-100 ${
                            notif.read ? "bg-gray-50" : "bg-white"
                          }`}
                        >
                          <div className="ml-3">
                            <p
                              className={`text-sm font-medium ${
                                notif.read ? "text-gray-500" : "text-gray-900"
                              }`}
                            >
                              {notif.title}
                            </p>
                            <p
                              className={`mt-1 text-sm ${
                                notif.read ? "text-gray-500" : "text-gray-600"
                              }`}
                            >
                              {notif.body}
                            </p>
                            <p
                              className={`mt-1 text-xs ${
                                notif.read ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {notif.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          {!notif.read && (
                            <button
                              type="button"
                              onClick={() => markAsRead(notif.id)}
                              className="p-1 ml-auto text-gray-400 rounded-full hover:bg-gray-200"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ),
              )
            ) : (
              <p className="px-4 py-3 text-sm text-center text-gray-600">
                No new notifications
              </p>
            )}
          </div>
          <div className="flex items-center justify-center px-4 py-2 border-t">
            <button
              type="button"
              onClick={handleSendNotification}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Send Test Notification
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
