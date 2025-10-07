import crypto from "crypto"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import {
  sendEmail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
} from "../utils/mail.js"
import { asyncHandler } from "../utils/async-handler.js"
import { ApiResponse } from "../utils/api-response.js"
import { User } from "../models/user.models.js"

import { upsertStreamUser } from "../lib/stream.js"

import { uploadOnCloudinary } from "../utils/cloudinary.js"












const register = asyncHandler(async (req, res) => {
  const {
    bio,
    city,
    nativeLanguage,
    desiredLanguage,
    email,
    username,
    password,
    fullname,
  } = req.body

 const existingUser = await User.findOne({
  $or: [{ email }, { username }]
});

if (existingUser) {
  return res
    .status(400)
    .json(new ApiResponse(400, null, "Email or username already exists"));
}

const profilePicLocalPath = req.file?.path;
    let profilePicUrl = "https://ui-avatars.com/api/?name=User&background=random"; // Default URL

    if (profilePicLocalPath) {
        const uploadedImage = await uploadOnCloudinary(profilePicLocalPath);
        if (uploadedImage) {
            profilePicUrl = uploadedImage.secure_url;
        } else {
            // Handle upload failure if necessary
            console.error("Profile picture upload failed.");
        }
    }


    const newUser = new User({
        email,
        username,
        password,
        fullname,
        profilePic: profilePicUrl, // ✅ Use the URL from Cloudinary
        bio,
        city,
        nativeLanguage,
        desiredLanguage,
    })

  const { unHashedToken, hashedToken, tokenExpiry } =
    newUser.generateTemporaryToken()

  newUser.emailVerificationToken = hashedToken
  newUser.emailVerificationExpiry = tokenExpiry

  const mailgenContent = emailVerificationMailgenContent(
    newUser.fullname,
    `${process.env.BASE_URl}/verify/${unHashedToken}`
  )

  sendEmail({
    email: newUser.email,
    subject: "Verify Your email",
    mailgenContent: mailgenContent,
  })

  await newUser.save()
  console.log("newUser.email:", newUser.email)

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        newUser.email,
        "Verification email sent successfully"
      )
    )
})

const verifyUser = asyncHandler(async (req, res) => {
  console.log("hello")
  const token = req.params.token
  console.log("Token from URL:", token)

  if (!token) {
    return res.status(400).json({ message: "Invalid token" })
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

  // Find user with this token and (optional) check if not expired
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
  })

  if (!user) {
    return res.status(400).json({ message: "User Not Found" })
  }

  const userExpiry = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  })

  if (!userExpiry) {
    await User.deleteOne()
    return res.status(400).json({ message: "Token Expired" })
  }



  user.isEmailVerified = true
  user.emailVerificationToken = undefined // clear token after use
  await user.save()

  try {
    await upsertStreamUser({
      id: user._id.toString(),
      name: user.fullname,
      image: user.profilePic,
    })
    console.log(`Stream user created for ${user.fullname}`)
  } catch (error) {
    console.log("Error creating Stream user:", error)
  }

  return res.status(200).json({ message: "Email verified successfully" })
})

const login = asyncHandler(async (req, res) => {
  //getting emial and password
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    })
  }

  //Checking is verified
  const user = await User.findOne({ email, isEmailVerified: true })

  if (!user) {
    return res.status(400).json({
      message: "Invalid User Please Register or verify",
    })
  }

  //checking password
  console.log("Password from body:", password)
  console.log("Password from DB:", user.password)

  //verifying password
  const isPasswordValid = await user.isPasswordcorrect(password)

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password" })
  }

  //refresh token and access token
  const accessToken = user.generateAccessToken()

  const cookieOptions = {
    httpOnly: true, // Can't access cookie via JS in browser
    secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
    sameSite: "None", // Protection from CSRF
    maxAge: 5 * 24 * 60 * 60 * 1000,
    path: "/",
  }

  res.cookie("accessToken", accessToken, cookieOptions)

  // ✅ Send token with success response
  return res.status(200).json({
    message: "User login successful",
    accessToken,
  })
})

const getMe = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(400).json({
      success: false,
      message: "User Not Found",
    })
  }

  res.status(200).json({
    success: true,
    user: req.user,
  })
})

const logout = asyncHandler(async (req, res) => {
  const atoken = req.cookies.accessToken

  const decoded = jwt.verify(atoken, process.env.ACCESS_SECRET_KEY)

  const user = await User.findById(decoded?.id)

  if (!user) {
    return res.status(400).json({
      message: "Invalid User",
    })
  }

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
    secure: true, // Only over HTTPS (optional for dev)
    sameSite: "strict", // Protect against CSRF
  }

  res.cookie("accessToken", "", cookieOptions)

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  })
})

// const forgetPassword = asyncHandler(async (req, res) => {
//   try {
//     const { email } = req.body
//     const user = await User.findOne({ email })

//     if (!user) {
//       return res.status(400).json({
//         message: "User not Found",
//       })
//     }

//     const Token = crypto.randomBytes(16).toString("hex")

//     const hashedToken = crypto.createHash("sha256").update(Token).digest("hex")
//     console.log(`reset token ${hashedToken}`)
//     const expireTime = Date.now() + 10 * 60 * 1000

//     user.resetPasswordToken = hashedToken
//     user.resetPasswordExpires = expireTime
//     await user.save()

//     var transporter = nodemailer.createTransport({
//       host: process.env.MAILTRAP_HOST,
//       port: process.env.MAILTRAP_PORT,
//       auth: {
//         user: process.env.MAILTRAP_USER,
//         pass: process.env.MAILTRAP_PASS,
//       },
//     })

//     const mailOptions = {
//       from: process.env.MAILTRAP_SENDEREMAIL,
//       to: user.email,
//       subject: "Reset password link",
//       html: `
//                 <h1>reset Password</h1>
//                 <p>Click the link below to reset the password:</p>
//         <a href="${process.env.BASE_URL}api/v1/users/reset/${Token}">Reset Password</a>
//       `,
//     }
//     await transporter.sendMail(mailOptions)

//     res.status(200).json({
//       success: true,
//       message: "Reset link sent to your email",
//     })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({
//       success: false,
//       message: "reset failed",
//     })
//   }
// })

// const resetPassword = asyncHandler(async (req, res) => {
//   try {
//     const resetToken = req.params.token
//     console.log(resetToken)

//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex")

//     console.log(hashedToken)
//     console.log("Current time:", Date.now())

//     console.log("Date.now():", Date.now())
//     console.log("new Date():", new Date())
//     console.log("new Date(Date.now()):", new Date(Date.now()))

//     const user = await User.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpires: { $gt: Date.now() },
//     })

//     if (!user) {
//       return res
//         .status(400)
//         .json({ message: "Token is invalid or has expired" })
//     }

//     user.password = req.body.password // Make sure to hash it in pre-save middleware
//     user.resetPasswordToken = undefined
//     user.resetPasswordExpire = undefined

//     await user.save()

//     res.status(200).json({ message: "Password reset successfully" })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({
//       success: false,
//       message: "reset failed",
//     })
//   }
// })

export { register, verifyUser, login, getMe, logout }
