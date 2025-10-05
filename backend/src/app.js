import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import path from "path";
import { fileURLToPath } from "url"; // ✅ 1. Import fileURLToPath

const app = express();

// ✅ 2. Define __dirname for ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(process.env.BASE_URL);
app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- API Routes ---
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat", chatRoutes);

// --- Static Frontend Server (for deployment) ---
if (process.env.NODE_ENV === "production") {
  // Now this will work correctly
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend", "dist", "index.html"));
  });
}

export default app;