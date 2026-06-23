const multer = require("multer");
const sharp = require("sharp");
const { uploadToStorage } = require("../lib/storage");
const { withAuth } = require("../lib/auth");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG and WEBP allowed"));
    }
  },
});

const uploadFields = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "galleryImages", maxCount: 20 },
]);

/**
 * File upload endpoint for admin panel.
 * Processes images with sharp, uploads to Supabase Storage,
 * and returns public URLs.
 */
module.exports = withAuth(async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await new Promise((resolve, reject) => {
    uploadFields(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  try {
    const results = { coverImage: null, galleryImages: [] };

    // Process cover image
    if (req.files?.coverImage?.[0]) {
      const buffer = await sharp(req.files.coverImage[0].buffer)
        .resize({ width: 1200, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 75, effort: 6 })
        .toBuffer();

      const fileName = `${Date.now()}-cover.webp`;
      const url = await uploadToStorage("covers", fileName, buffer, "image/webp");
      results.coverImage = url;
    }

    // Process gallery images
    if (req.files?.galleryImages) {
      for (const file of req.files.galleryImages) {
        const buffer = await sharp(file.buffer)
          .resize({ width: 1600, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();

        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.webp`;
        const url = await uploadToStorage("gallery", fileName, buffer, "image/webp");
        results.galleryImages.push(url);
      }
    }

    // Handle blog cover uploads
    if (req.files?.blogCover?.[0]) {
      const buffer = await sharp(req.files.blogCover[0].buffer)
        .resize({ width: 1200, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 78 })
        .toBuffer();

      const fileName = `${Date.now()}-blog.webp`;
      const url = await uploadToStorage("blogs", fileName, buffer, "image/webp");
      results.blogCover = url;
    }

    // Handle client logo uploads
    if (req.files?.clientLogo?.[0]) {
      const buffer = await sharp(req.files.clientLogo[0].buffer)
        .resize({ width: 400, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer();

      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`;
      const url = await uploadToStorage("logos", fileName, buffer, "image/webp");
      results.clientLogo = url;
    }

    res.json(results);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});
