import express from "express"
import {
  getMyFriends,
  getRecommendedUsers,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getOutgoingFriendReqs,
  rejectFriendRequest,
} from "../controllers/user.controllers.js"

import { authMiddleware } from "../middlewares/auth.middlewares.js"

const router = express.Router()
router.use(authMiddleware)

router.get("/", getRecommendedUsers)
router.get("/friends", getMyFriends)
router.post("/friend-request/:id", sendFriendRequest)

router.put("/friend-request/:id/accept", acceptFriendRequest)
router.delete("/friend-request/:id/reject", rejectFriendRequest)

router.get("/friend-requests", getFriendRequests)
router.get("/outgoing-friend-requests", getOutgoingFriendReqs)
router.get("/outgoing-friend-requests", getOutgoingFriendReqs)

export default router
