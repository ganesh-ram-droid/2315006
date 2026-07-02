import express from "express";
import {
  getNotifications,
  getNotificationById,
  getPriorityNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  unreadCount,
} from "../Controller/notificationController.js";


const router = express.Router();

router.get("/", getNotifications);

router.get("/priority", getPriorityNotifications);

router.get("/unread-count", unreadCount);

router.get("/:id", getNotificationById);

router.patch("/read-all", markAllAsRead);

router.patch("/:id/read", markAsRead);

router.delete("/:id", deleteNotification);

export default router;
