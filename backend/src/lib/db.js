import mongoose from "mongoose"

const connectDb = async () => {
  console.log("MONGO_URL is:", process.env.MONGO_URL)

  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log("Connected to DB")
  } catch (error) {
    console.error("Moongo connection failed", error)
    process.exit(1)
  }
}

export default connectDb
