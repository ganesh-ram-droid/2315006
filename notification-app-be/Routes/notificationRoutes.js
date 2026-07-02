import express from "express";
import { getNotifications, getPriorityNotifications, markAsRead, unreadCount } from "../Controller/notificationController.js";


const router = express.Router();

router.get("/", getNotifications);

router.get("/priority", getPriorityNotifications);

router.patch("/:id/read", markAsRead);

router.get("/unread-count", unreadCount);

export default router;