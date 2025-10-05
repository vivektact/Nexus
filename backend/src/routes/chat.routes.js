import express from "express"
import { authMiddleware } from "../middlewares/auth.middlewares.js"
import { getStreamToken } from "../controllers/chat.controllers.js"

const router = express.Router()

router.get("/token", authMiddleware, getStreamToken)

export default router
