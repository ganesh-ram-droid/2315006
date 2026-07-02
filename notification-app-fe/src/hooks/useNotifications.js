import { useEffect, useState } from "react";
import {
  deleteNotification,
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../api/notifications";

export function useNotifications(page, filter) {
  const [notifications, setNotifications] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const data = await fetchNotifications(page, filter);

        const notificationList = data.notifications || data;
        const filteredNotifications = filter
          ? notificationList.filter((notification) => notification.type === filter)
          : notificationList;

        setNotifications(filteredNotifications);
        setTotalPages(data.totalPages || 1);

        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page, filter]);

  const markAsRead = async (id) => {
    const data = await markNotificationAsRead(id);

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? data.notification : notification
      )
    );
  };

  const markAllAsRead = async () => {
    const data = await markAllNotificationsAsRead();

    setNotifications(data.notifications || []);
  };

  const removeNotification = async (id) => {
    await deleteNotification(id);

    setNotifications((current) =>
      current.filter((notification) => notification.id !== id)
    );
  };

  return {
    notifications,
    totalPages,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    removeNotification,
  };
}
