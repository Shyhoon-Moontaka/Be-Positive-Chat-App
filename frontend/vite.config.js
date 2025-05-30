import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";
dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    "process.env.REACT_APP_GOOGLE_CLIENT_ID": JSON.stringify(
      process.env.REACT_APP_GOOGLE_CLIENT_ID
    ),
    "process.env.REACT_APP_SERVER_URL": JSON.stringify(
      process.env.REACT_APP_SERVER_URL
    ),
  },
});
