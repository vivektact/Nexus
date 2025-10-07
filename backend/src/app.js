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


const app = express();

console.log(process.env.BASE_URL);
app.use(
  cors({
    origin: "https://nexus-frontend-0r8u.onrender.com",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat", chatRoutes);


export default app;
