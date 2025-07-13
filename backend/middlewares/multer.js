import multer from "multer";
import fs from "fs";

// Ensure the uploads directory exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads/");
  },
  filename: function (req, file, callback) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    callback(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

export default upload;
