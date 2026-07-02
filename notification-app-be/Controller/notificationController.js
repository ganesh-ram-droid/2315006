import notifications from "../data/notifications.js";
import { Log } from "../Middleware/log.js";

// Priority Levels
const priorityValue = {
  High: 3,
  Medium: 2,
  Low: 1,
};

// Get All Notifications
export const getNotifications = async (req, res) => {
  try {
    await Log(
      "backend",
      "info",
      "controller",
      "Fetching all notifications"
    );

    res.status(200).json(notifications);
  } catch (error) {
    await Log(
      "backend",
      "error",
      "controller",
      error.message
    );

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Get Priority Notifications
export const getPriorityNotifications = async (req, res) => {
  try {
    await Log(
      "backend",
      "info",
      "controller",
      "Fetching priority notifications"
    );

    const topNotifications = [...notifications]
      .sort((a, b) => {
        if (priorityValue[b.priority] !== priorityValue[a.priority]) {
          return priorityValue[b.priority] - priorityValue[a.priority];
        }

        return new Date(b.createdAt) - new Date(a.createdAt);
      })
      .slice(0, 10);

    res.status(200).json(topNotifications);
  } catch (error) {
    await Log(
      "backend",
      "error",
      "controller",
      error.message
    );

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Mark Notification as Read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = notifications.find((n) => n.id === id);

    if (!notification) {
      await Log(
        "backend",
        "warn",
        "controller",
        `Notification with id ${id} not found`
      );

      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await Log(
      "backend",
      "info",
      "controller",
      `Notification ${id} marked as read`
    );

    res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    await Log(
      "backend",
      "error",
      "controller",
      error.message
    );

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Get Unread Notification Count
export const unreadCount = async (req, res) => {
  try {
    await Log(
      "backend",
      "info",
      "controller",
      "Fetching unread notification count"
    );

    const count = notifications.filter((n) => !n.isRead).length;

    res.status(200).json({
      unreadCount: count,
    });
  } catch (error) {
    await Log(
      "backend",
      "error",
      "controller",
      error.message
    );

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};