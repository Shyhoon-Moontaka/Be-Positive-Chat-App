import express from "express";
import dotenv from "dotenv/config";
import mongoDBConnect from "./mongoDB/connection.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./routes/user.js";
import chatRoutes from "./routes/chat.js";
import notificationRoutes from "./routes/notification.js";
import messageRoutes from "./routes/message.js";
import * as Server from "socket.io";
const app = express();

const corsConfig = {
  origin: process.env.BASE_URL,
  credentials: true,
};
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsConfig));
app.use("/", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notification", notificationRoutes);
mongoose.set("strictQuery", false);
mongoDBConnect();
const server = app.listen(PORT, () => {
  console.log(`Server Listening at PORT - ${PORT}`);
});
export const io = new Server.Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
