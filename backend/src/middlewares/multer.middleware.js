import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ensure this directory exists in your project root
        cb(null, "./public/temp"); 
    },
    filename: function (req, file, cb) {
        // Use the original filename
        cb(null, file.originalname);
    }
});

export const upload = multer({ 
    storage, 
});