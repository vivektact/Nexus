import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // Node.js File System module

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a file to Cloudinary and deletes the local copy.
 * @param {string} localFilePath The path to the file on the local server.
 * @returns {object | null} The Cloudinary response object or null on failure.
 */
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        
        // Delete the locally saved temporary file after successful upload
        fs.unlinkSync(localFilePath); 
        
        return response;

    } catch (error) {
        // If the upload fails, delete the local file as well
        fs.unlinkSync(localFilePath);
        console.error("Cloudinary Upload Error:", error);
        return null;
    }
};

export { uploadOnCloudinary };