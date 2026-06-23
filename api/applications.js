const crypto = require("crypto");
const multer = require("multer");
const sharp = require("sharp");
const { uploadToStorage } = require("../lib/storage");
const supabase = require("../lib/supabase");
const transporter = require("../lib/mail");
const { syncApplicationRecords } = require("../lib/sync");

// Multer for in-memory file parsing (works in serverless)
const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, and DOCX allowed"));
    }
  },
});

const uploadMiddleware = resumeUpload.single("resume");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Parse multipart form data
  await new Promise((resolve, reject) => {
    uploadMiddleware(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  const { name, email, position, phone, portfolio, linkedin, coverNote } = req.body;
  if (!name || !email || !position) {
    return res.status(400).json({ error: "Name, email, and position are required" });
  }

  let resumeUrl = "";
  if (req.file) {
    try {
      const safeName = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "-")}`;
      resumeUrl = await uploadToStorage("resumes", safeName, req.file.buffer, req.file.mimetype);
    } catch (err) {
      console.error("Resume upload failed:", err.message);
    }
  }

  try {
    const appId = crypto.randomUUID();
    const { error } = await supabase.from("applications").insert({
      id: appId,
      name, email, position,
      phone: phone || "",
      portfolio: portfolio || "",
      linkedin: linkedin || "",
      coverNote: coverNote || "",
      resume: resumeUrl,
      status: "new",
    });

    if (error) throw error;

    // Background sync (fire and forget)
    syncApplicationRecords().catch((syncErr) => {
      console.error("Background spreadsheet sync failed:", syncErr.message);
    });

    // Send confirmation email
    let mailResult = null;
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const info = await transporter.sendMail({
          from: `"Adway Careers" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: `Application Received — ${position}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 40px 32px; color: #111111; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px;">
              <h2 style="font-size: 20px; font-weight: 600; color: #111111; margin-bottom: 16px;">Hi ${name},</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">
                Thank you for applying to join our team at Adway. We have safely received your submission for the <strong>${position}</strong> opening.
              </p>
              <div style="background-color: #f9fafb; padding: 16px 20px; border-left: 3px solid #111111; margin-bottom: 24px; border-radius: 4px;">
                <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; font-weight: 600;">Submission Parameters</p>
                <p style="margin: 6px 0 0 0; font-size: 14px; color: #1f2937;"><strong>Target Position:</strong> ${position}</p>
              </div>
              <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin-bottom: 32px;">
                Our talent acquisition team evaluates portfolios individually. If your expertise aligns with our goals, we will follow up within 5–7 business days.
              </p>
              <hr style="border: 0; border-top: 1px solid #e5e7eb; margin-bottom: 20px;" />
              <p style="font-size: 11px; text-align: center; color: #9ca3af; margin: 0;">
                This automated verification was dispatched by Adway Systems.
              </p>
            </div>
          `,
        });
        mailResult = { success: true, messageId: info.messageId };
      } catch (mailError) {
        mailResult = { success: false, error: mailError.message };
      }
    }

    res.status(201).json({ success: true, id: appId, mail: mailResult });
  } catch (err) {
    console.error("Application error:", err);
    res.status(500).json({ error: "Failed to save application", details: err.message });
  }
};
