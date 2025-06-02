import express from "express";
const router = express.Router();
import { Auth } from "../middleware/user.js";
import {
  deleteNotification,
  getNotification,
} from "../controllers/notificationController.js";
router.get("/", Auth, getNotification);
router.delete("/:Id/:userId", Auth, deleteNotification);
export default router;
