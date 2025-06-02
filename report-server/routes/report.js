import express from "express";
import { reportMessage } from "../controllers/reportController.js";
const router = express.Router();
router.post("/report", reportMessage);
export default router;
