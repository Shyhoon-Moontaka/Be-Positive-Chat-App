import express from "express";
import dotenv from "dotenv/config";
import cors from "cors";
import reportRoutes from "./routes/report.js";

const app = express();

const corsConfig = {
  origin: process.env.BASE_URL || "*",
  credentials: true,
};
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors(corsConfig));
app.use("/", reportRoutes);

app.listen(PORT, () => {
  console.log(`ML Server Listening at PORT - ${PORT}`);
});
