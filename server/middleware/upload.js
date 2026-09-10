const multer = require('multer');
const path = require('path');
const UPLOAD_DIR = path.join(__dirname, "uploads");
const COVER_DIR = path.join(UPLOAD_DIR, "covers");
const GALLERY_DIR = path.join(UPLOAD_DIR, "gallery");

fs.mkdirSync(COVER_DIR, { recursive: true });
fs.mkdirSync(GALLERY_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50 MB
    }
});

module.exports = upload;