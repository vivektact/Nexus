import { User } from "../models/user.models.js"
import { asyncHandler } from "../utils/async-handler.js"
import { ApiResponse } from "../utils/api-response.js"
import FriendRequest from "../models/friendRequest.js"
import { streamClient } from "../lib/stream.js"; 


export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user._id;
        const currentUser = req.user;

        // 1. Find users who are not the current user and not already friends
        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } },
                { _id: { $nin: currentUser.friends } },
                { isEmailVerified: true },
                { desiredLanguage: currentUser.desiredLanguage },
            ],
        }).lean(); // Use .lean() for better performance and easier object manipulation

        // 2. Find all pending friend requests involving the current user
        const pendingRequests = await FriendRequest.find({
            $or: [{ sender: currentUserId }, { recipient: currentUserId }],
            status: "pending",
        });

        // 3. Create sets for quick lookups
        const sentRequestIds = new Set(
            pendingRequests
                .filter((req) => req.sender.equals(currentUserId))
                .map((req) => req.recipient.toString())
        );
        const receivedRequestIds = new Set(
            pendingRequests
                .filter((req) => req.recipient.equals(currentUserId))
                .map((req) => req.sender.toString())
        );
        
        // 4. Add a 'friendRequestStatus' to each recommended user
        const usersWithStatus = recommendedUsers.map((user) => {
            const userIdStr = user._id.toString();
            if (sentRequestIds.has(userIdStr)) {
                return { ...user, friendRequestStatus: "sent" };
            }
            if (receivedRequestIds.has(userIdStr)) {
                return { ...user, friendRequestStatus: "received" };
            }
            return { ...user, friendRequestStatus: "none" };
        });

        res.status(200).json(usersWithStatus);
        
    } catch (error) {
        console.error("Error in getRecommendedUsers controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullname profilePic nativeLanguage desiredLanguage")

    res.status(200).json(user.friends)
  } catch (error) {
    console.error("Error in getMyFriends controller", error.message)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id
    const { id: recipientId } = req.params

    // prevent sending req to yourself
    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "You can't send friend request to yourself" })
    }

    const recipient = await User.findById(recipientId)
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" })
    }

    // check if user is already friends
    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user" })
    }

    // check if a req already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    })

    if (existingRequest) {
      return res
        .status(400)
        .json({
          message: "A friend request already exists between you and this user",
        })
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    })

    res.status(201).json(friendRequest)
  } catch (error) {
    console.error("Error in sendFriendRequest controller", error.message)
    res.status(500).json({ message: "Internal Server Error" })
  }
}


export async function acceptFriendRequest(req, res) {
    try {
        const { id: requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        if (friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept this request" });
        }

        // --- ✅ NEW: ENSURE BOTH USERS EXIST IN STREAM ---
        
        // 1. Fetch the full user documents to get their details
        const sender = await User.findById(friendRequest.sender);
        const recipient = await User.findById(friendRequest.recipient);

        if (!sender || !recipient) {
            return res.status(404).json({ message: "One of the users in the request could not be found." });
        }

        // 2. Upsert both users to Stream Chat to guarantee they can chat
        try {
            await streamClient.upsertUsers([
                {
                    id: sender._id.toString(),
                    name: sender.fullname,
                    image: sender.profilePic,
                },
                {
                    id: recipient._id.toString(),
                    name: recipient.fullname,
                    image: recipient.profilePic,
                },
            ]);
            console.log("Sender and recipient synced to Stream.");
        } catch (streamError) {
            console.error("Error syncing users to Stream on friend request accept:", streamError);
            // We can still proceed even if this fails, but it's important to log it.
        }

        // --- EXISTING LOGIC ---

        // 3. Update the friend request status
        friendRequest.status = "accepted";
        await friendRequest.save();

        // 4. Add each user to the other's friends array in MongoDB
        await User.findByIdAndUpdate(sender._id, {
            $addToSet: { friends: recipient._id },
        });

        await User.findByIdAndUpdate(recipient._id, {
            $addToSet: { friends: sender._id },
        });

        // 5. Delete the friend request document now that it's completed
        await FriendRequest.findByIdAndDelete(requestId);
        
        res.status(200).json({ message: "Friend request accepted" });

    } catch (error) {
        console.error("Error in acceptFriendRequest controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}




export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullname profilePic nativeLanguage desiredLanguage")

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullname profilePic")

    res.status(200).json({ incomingReqs, acceptedReqs })
  } catch (error) {
    console.log("Error in getPendingFriendRequests controller", error.message)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "recipient",
      "fullname profilePic nativeLanguage desiredLanguage"
    )

    res.status(200).json(outgoingRequests)
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export async function rejectFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params

    const friendRequest = await FriendRequest.findById(requestId)

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" })
    }

    // Verify the current user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to reject this request" })
    }

    // Delete the friend request completely
    await FriendRequest.findByIdAndDelete(requestId)

    res.status(200).json({ message: "Friend request rejected and removed" })
  } catch (error) {
    console.log("Error in rejectFriendRequest controller", error.message)
    res.status(500).json({ message: "Internal Server Error" })
  }
}
