const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configuração do multer para armazenar as imagens
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "";
    if (file.fieldname === "profileImage") {
      folder = "users";
    } else if (file.fieldname === "image") {
      folder = "photos";
    }

    const uploadPath = path.join(__dirname, "..", "uploads", folder);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const imageUpload = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    if (
      !file.originalname.toLowerCase().endsWith(".jpg") &&
      !file.originalname.toLowerCase().endsWith(".jpeg") &&
      !file.originalname.toLowerCase().endsWith(".png")
    ) {
      cb(new Error("Invalid file type. Only images are allowed."));
    } else {
      cb(null, true);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
});

module.exports = imageUpload;
