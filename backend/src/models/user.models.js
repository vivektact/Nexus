import mongoose, { Schema } from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userSchema = new Schema(
  {
    profilePic: {
      type: String,
      default: "https://ui-avatars.com/api/?name=User&background=random"// A simple default URL
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      index: true,
      trim: true,
    },
    bio: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      lowecase: true,
      index: true,
      trim: true,
    },
    nativeLanguage: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    desiredLanguage: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
)

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

userSchema.methods.isPasswordcorrect = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.generateAccessToken = function () {
  const token = jwt.sign(
    { id: this.id, email: this.email },
    process.env.ACCESS_SECRET_KEY,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  )

  return token
}

userSchema.methods.generateTemporaryToken = function () {
  const unHashedToken = crypto.randomBytes(20).toString("hex")

  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex")

  const tokenExpiry = Date.now() + 60 * 60 * 1000

  return { unHashedToken, hashedToken, tokenExpiry }
}

export const User = mongoose.model("User", userSchema)
