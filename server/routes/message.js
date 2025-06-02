import express from "express";
const router = express.Router();
import {
  sendMessage,
  getMessages,
  reportMessage,
} from "../controllers/messageControllers.js";
import { Auth } from "../middleware/user.js";
router.post("/", Auth, sendMessage);
router.get("/:chatId", Auth, getMessages);
router.post("/report", Auth, reportMessage);
export default router;
