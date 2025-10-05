import express from "express"
import {
  register,
  login,
  logout,
  getMe,
  verifyUser,
} from "../controllers/auth.controllers.js"
import { authMiddleware } from "../middlewares/auth.middlewares.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = express.Router()

router.post("/register", upload.single("profilePic"), register)
router.post("/login", login)
router.post("/logout", logout)
router.get("/me", authMiddleware, getMe)
router.post("/verify/:token", verifyUser)

export default router
