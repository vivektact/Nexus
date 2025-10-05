import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js" // Import your Mongoose User model
import { ApiResponse } from "../utils/api-response.js"

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.accessToken

  if (!token) {
    return res
      .status(403)
      .json(new ApiResponse(403, token, "User not available"))
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_KEY)

    const user = await User.findById(decodedToken?.id).select("-password")
    if (!user) {
      return res.status(400).json(new ApiResponse(400, user, "User not found"))
    }
    req.user = user

    next()
  } catch (error) {
    return res.status(403).json({
      message: error?.message || "Invalid token.",
    })
  }
}
