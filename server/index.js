require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");
const ExcelJS = require("exceljs");
const { google } = require("googleapis");
const path = require("path");
const UPLOAD_DIR = path.join(__dirname, "uploads");
const COVER_DIR = path.join(UPLOAD_DIR, "covers");
const GALLERY_DIR = path.join(UPLOAD_DIR, "gallery");
const RESUME_DIR = path.join(UPLOAD_DIR, "resumes");
const LOGO_DIR = path.join(UPLOAD_DIR, "logos");
const BLOG_DIR = path.join(UPLOAD_DIR, "blogs");
const nodemailer = require("nodemailer")

if (!fs.existsSync(COVER_DIR)) {
  fs.mkdirSync(COVER_DIR, { recursive: true });
}

if (!fs.existsSync(GALLERY_DIR)) {
  fs.mkdirSync(GALLERY_DIR, { recursive: true });
}

if (!fs.existsSync(RESUME_DIR)) {
  fs.mkdirSync(RESUME_DIR, { recursive: true });
}

if (!fs.existsSync(LOGO_DIR)) {
  fs.mkdirSync(LOGO_DIR, { recursive: true });
}

if (!fs.existsSync(BLOG_DIR)) {
  fs.mkdirSync(BLOG_DIR, { recursive: true });
}

const db = require("./config/db");

const app = express();
console.log("📁 Server directory:", __dirname);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

/* ═══ SECURITY MIDDLEWARE ═══ */
app.use(helmet({ crossOriginResourcePolicy: false }));
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS policy does not allow access from origin ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({
  extended: true,
  limit: "2mb"
}));


// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,
  message: { error: "Too many login attempts. Try again later." },
});
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

/* ═══ DATA STORAGE ═══ */
const DATA_DIR = path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function readJSON(file, fallback = []) {
  const fp = path.join(DATA_DIR, file);
  if (!fs.existsSync(fp)) return fallback;
  return JSON.parse(fs.readFileSync(fp, "utf-8"));
}
function writeJSON(file, data) {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-3.5-turbo";
const OPENAI_API_BASE = process.env.OPENAI_API_BASE || "https://api.openai.com/v1";
const CHATBOT_PROMPT_FILE = path.join(__dirname, "chatbot.md");
const CHATBOT_ENQUIRIES_FILE = "chatbot_enquiries.json";

function readChatbotEnquiries() {
  return readJSON(CHATBOT_ENQUIRIES_FILE, []);
}

function saveChatbotEnquiries(enquiries) {
  writeJSON(CHATBOT_ENQUIRIES_FILE, enquiries);
}

function addChatbotEnquiry(enquiry) {
  const enquiries = readChatbotEnquiries();
  enquiries.unshift(enquiry);
  if (enquiries.length > 200) enquiries.length = 200;
  saveChatbotEnquiries(enquiries);
}

function loadChatbotPrompt() {
  if (fs.existsSync(CHATBOT_PROMPT_FILE)) {
    return fs.readFileSync(CHATBOT_PROMPT_FILE, "utf-8").trim();
  }

  return `You are "Adway Creative Assistant", the premium AI consultant for Adway Creations.

Your purpose is to help visitors discover the right branding, design, marketing, and development services while generating qualified leads.

PERSONALITY:
- Professional and premium
- Friendly and confident
- Short and clear responses
- Solution-focused
- Never use technical jargon unless requested

IMPORTANT RULES:
1. Keep responses under 80 words.
2. Always guide users using selectable options.
3. Never ask multiple open-ended questions.
4. Present choices as buttons whenever possible.
5. Focus on understanding business goals before discussing pricing.
6. Collect lead information naturally after identifying needs.
7. Highlight Adway Creations' expertise in:
   - Brand Strategy
   - Logo Design
   - Visual Identity
   - Website Development
   - Social Media Marketing
   - Video Production
   - Performance Marketing
8. Recommend services based on business goals.
9. If unsure, ask users to choose from predefined options.
10. Always move the conversation toward booking a consultation.

WELCOME MESSAGE:

👋 Welcome to Adway Creations.

We help businesses build memorable brands, high-performing websites, and result-driven marketing campaigns.

What would you like help with today?

[Logo Design]
[Brand Identity]
[Website Development]
[Social Media Marketing]
[Video Production]
[Marketing Strategy]

When a service is selected, continue with guided questions and progressively qualify the lead.

Once enough information is collected, ask:

"Would you like a free consultation with our team?"

[Book Consultation]
[Request Proposal]
[Talk to Expert]

Collect:
- Name
- Business Name
- Email
- Phone Number
- Project Requirements

End with:

"Thank you for choosing Adway Creations. Our team will reach out shortly with the next steps."`;
}

function loadChatbotKnowledge() {
  const defaultKnowledge = {
    brandName: "Adway",
    brandTagline: "Creative branding, digital design, and motion marketing that helps businesses grow.",
    description:
      "Adway is a creative branding studio that builds modern brands, digital products, motion experiences, and marketing design for startups and growth teams.",
    values: "Creativity, collaboration, quality, and brand-led growth.",
    services: [
      "Brand Strategy",
      "Visual Identity",
      "Digital Product Design",
      "Motion Graphics",
      "Brand Guidelines",
      "Campaign Design",
    ],
    careers:
      "We hire designers, strategists, marketing specialists, and creative talent. Visit the careers page for current openings and application details.",
    contact: process.env.CLIENT_URL || "http://localhost:5173",
  };

  return { ...defaultKnowledge, ...readJSON("chatbot_knowledge.json", {}) };
}

function buildChatbotSystemMessage() {
  return loadChatbotPrompt();
}

function getLocalChatbotReply(message, knowledge) {
  const lower = message.toLowerCase();
  if (lower.includes("service") || lower.includes("offer") || lower.includes("what do you")) {
    return `Adway offers ${knowledge.services.join(", ")}. Each service is tailored to your business needs — from brand strategy and identity to digital product design, motion graphics, and brand growth.`;
  }
  if (
    lower.includes("cost") ||
    lower.includes("price") ||
    lower.includes("pricing") ||
    lower.includes("how much")
  ) {
    return "Our pricing is project-based and depends on scope, timeline, and deliverables. For the best estimate, please share more about your project so our team can tailor a proposal.";
  }
  if (
    lower.includes("long") ||
    lower.includes("timeline") ||
    lower.includes("take") ||
    lower.includes("duration")
  ) {
    return "Project timelines depend on the scope: identity work can take 6–8 weeks, while a full branding and digital design initiative can take 10–12 weeks or more. Let us know your goals so we can recommend the right pace.";
  }
  if (lower.includes("career") || lower.includes("job") || lower.includes("hiring") || lower.includes("apply")) {
    return `${knowledge.careers} You can review current openings on the careers page and submit your application there.`;
  }
  if (lower.includes("portfolio") || lower.includes("work") || lower.includes("projects")) {
    return "Adway creates brand-led digital experiences, identity systems, motion graphics, and product design work. Check our portfolio page to see recent projects and case studies.";
  }
  if (lower.includes("contact") || lower.includes("hire") || lower.includes("connect")) {
    return `You can reach out through the contact page, or share your project details there and our team will respond.`;
  }
  return "Thanks for your question! For the most accurate answer, I recommend sharing a few details about your goals, and our team will be happy to help.";
}



async function getChatbotReply(message, history = []) {
  const knowledge = loadChatbotKnowledge();
  const messages = [
    { role: "system", content: buildChatbotSystemMessage(knowledge) },
    ...history,
    { role: "user", content: message },
  ];

  if (OPENAI_API_KEY) {
    try {
      return await fetchOpenAIChatCompletion(messages);
    } catch (error) {
      console.error("OpenAI chatbot error, falling back:", error.message || error);
    }
  }

  // This ensures a valid string reply is ALWAYS returned
  return getLocalChatbotReply(message, knowledge);
}

function logActivity(action, userEmail, ip) {
  const activity = readJSON("activity.json", []);
  activity.unshift({
    action,
    user: userEmail,
    ip,
    time: new Date().toISOString(),
  });
  if (activity.length > 100) activity.length = 100;
  writeJSON("activity.json", activity);
}

const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID;
const GOOGLE_SHEET_NAME = process.env.GOOGLE_SHEET_NAME || "Sheet1";

const MS_GRAPH_TENANT_ID = process.env.MS_GRAPH_TENANT_ID;
const MS_GRAPH_CLIENT_ID = process.env.MS_GRAPH_CLIENT_ID;
const MS_GRAPH_CLIENT_SECRET = process.env.MS_GRAPH_CLIENT_SECRET;
const MS_GRAPH_USER_ID = process.env.MS_GRAPH_USER_ID;
const MS_GRAPH_WORKBOOK_ITEM_ID = process.env.MS_GRAPH_WORKBOOK_ITEM_ID;
const MS_GRAPH_WORKBOOK_SHEET_NAME = process.env.MS_GRAPH_WORKBOOK_SHEET_NAME || "Sheet1";

function buildApplicationTableRows(apps) {
  const header = [
    "ID",
    "Name",
    "Email",
    "Position",
    "Phone",
    "Portfolio",
    "LinkedIn",
    "Cover Note",
    "Resume",
    "Status",
    "Created At",
    "Updated At",
  ];

  const rows = apps.map((app) => [
    app.id,
    app.name,
    app.email,
    app.position,
    app.phone || "",
    app.portfolio || "",
    app.linkedin || "",
    app.coverNote || "",
    app.resume || "",
    app.status || "",
    app.created_at ? new Date(app.created_at).toISOString() : "",
    app.updated_at ? new Date(app.updated_at).toISOString() : "",
  ]);

  return [header, ...rows];
}

async function createApplicationsExcelBuffer(apps) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Applications");

  const rows = buildApplicationTableRows(apps);
  worksheet.addRows(rows);
  worksheet.columns.forEach((column) => {
    column.width = 22;
  });
  worksheet.getRow(1).font = { bold: true };
  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  return workbook.xlsx.writeBuffer();
}

async function getAllApplications() {
  const [rows] = await db.query("SELECT * FROM applications ORDER BY created_at DESC");
  return rows;
}

async function getGoogleAuth() {
  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_SERVICE_ACCOUNT_KEY) return null;
  const auth = new google.auth.JWT(
    GOOGLE_SERVICE_ACCOUNT_EMAIL,
    null,
    GOOGLE_SERVICE_ACCOUNT_KEY,
    ["https://www.googleapis.com/auth/spreadsheets"],
  );
  await auth.authorize();
  return auth;
}

async function syncApplicationsToGoogleSheet(apps) {
  if (!GOOGLE_SHEETS_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_SERVICE_ACCOUNT_KEY) {
    throw new Error("Google Sheets sync is not configured.");
  }

  const auth = await getGoogleAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const values = buildApplicationTableRows(apps);

  await sheets.spreadsheets.values.update({
    spreadsheetId: GOOGLE_SHEETS_ID,
    range: `${GOOGLE_SHEET_NAME}!A1`,
    valueInputOption: "RAW",
    requestBody: { values },
  });
}

async function getMicrosoftGraphAccessToken() {
  if (!MS_GRAPH_TENANT_ID || !MS_GRAPH_CLIENT_ID || !MS_GRAPH_CLIENT_SECRET) return null;
  const url = `https://login.microsoftonline.com/${MS_GRAPH_TENANT_ID}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    client_id: MS_GRAPH_CLIENT_ID,
    client_secret: MS_GRAPH_CLIENT_SECRET,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.error || "Graph token request failed.");
  return data.access_token;
}

async function syncApplicationsToMicrosoftGraph(apps) {
  if (!MS_GRAPH_WORKBOOK_ITEM_ID || !MS_GRAPH_TENANT_ID || !MS_GRAPH_CLIENT_ID || !MS_GRAPH_CLIENT_SECRET) {
    throw new Error("Microsoft Graph sync is not configured.");
  }

  const token = await getMicrosoftGraphAccessToken();
  const workbookPath = MS_GRAPH_USER_ID
    ? `/users/${MS_GRAPH_USER_ID}/drive/items/${MS_GRAPH_WORKBOOK_ITEM_ID}`
    : `/me/drive/items/${MS_GRAPH_WORKBOOK_ITEM_ID}`;
  const values = buildApplicationTableRows(apps);
  const url = `https://graph.microsoft.com/v1.0${workbookPath}/workbook/worksheets('${encodeURIComponent(
    MS_GRAPH_WORKBOOK_SHEET_NAME,
  )}')/range(address='A1')`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Microsoft Graph sync failed: ${res.status} ${body}`);
  }
}

async function syncApplicationRecords() {
  const apps = await getAllApplications();
  const result = { google: null, microsoft: null };

  if (GOOGLE_SHEETS_ID && GOOGLE_SERVICE_ACCOUNT_EMAIL && GOOGLE_SERVICE_ACCOUNT_KEY) {
    try {
      await syncApplicationsToGoogleSheet(apps);
      result.google = "ok";
    } catch (err) {
      result.google = err.message;
    }
  }

  if (MS_GRAPH_WORKBOOK_ITEM_ID && MS_GRAPH_TENANT_ID && MS_GRAPH_CLIENT_ID && MS_GRAPH_CLIENT_SECRET) {
    try {
      await syncApplicationsToMicrosoftGraph(apps);
      result.microsoft = "ok";
    } catch (err) {
      result.microsoft = err.message;
    }
  }

  return result;
}

/* ═══ ADMIN USER SETUP ═══ */
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@adway.com").trim().toLowerCase();
const ADMIN_PASS = process.env.ADMIN_PASS || "Adway@2026!";
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString("hex");
const JWT_EXPIRES = "2h";

async function ensureAdminUserInDatabase() {
  const normalizedEmail = ADMIN_EMAIL.trim().toLowerCase();
  const hashedPassword = bcrypt.hashSync(ADMIN_PASS, 12);

  const [existingRows] = await db.execute("SELECT * FROM users WHERE email = ? LIMIT 1", [normalizedEmail]);
  if (existingRows.length > 0) {
    const existingUser = existingRows[0];
    const updates = [];
    const values = [];

    if (existingUser.role !== "admin") {
      updates.push("role = ?");
      values.push("admin");
    }

    if (existingUser.password !== hashedPassword) {
      updates.push("password = ?");
      values.push(hashedPassword);
    }

    if (updates.length > 0) {
      values.push(existingUser.id);
      await db.execute(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, values);
    }

    return { email: normalizedEmail, password: ADMIN_PASS };
  }

  const [adminRows] = await db.execute("SELECT * FROM users WHERE role = 'admin' LIMIT 1");
  if (adminRows.length > 0) {
    const existingAdmin = adminRows[0];
    await db.execute("UPDATE users SET email = ?, password = ? WHERE id = ?", [normalizedEmail, hashedPassword, existingAdmin.id]);
    return { email: normalizedEmail, password: ADMIN_PASS };
  }

  const userId = crypto.randomUUID();
  await db.execute("INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)", [userId, normalizedEmail, hashedPassword, "admin"]);
  return { email: normalizedEmail, password: ADMIN_PASS };
}

/* ═══ AUTH HELPERS ═══ */
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer "))
    return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(header.split(" ")[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/* ═══ AUTH ROUTES ═══ */

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/webp"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG and WEBP allowed"));
    }
  },
});

const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, and DOCX allowed"));
    }
  },
});


app.post("/api/auth/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];

    if (!user || !bcrypt.compareSync(password, user.password)) {
      logActivity("failed_login_attempt", email || "unknown", req.ip);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    logActivity("login_success", user.email, req.ip);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/auth/verify", authMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user });
});

app.post("/api/auth/logout", authMiddleware, (req, res) => {
  logActivity("logout", req.user.email, req.ip);
  res.json({ success: true });
});

/* ═══ ADMIN API ROUTES ═══ */

// Dashboard stats
app.get("/api/admin/stats", authMiddleware, async (req, res) => {
  try {
    const messages = readJSON("messages.json", []);
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);

    const [[{ count: chatEnquiriesCount }]] = await db.query("SELECT COUNT(*) as count FROM chat_enquiries");
    const [[{ count: chatEnquiriesNewCount }]] = await db.query("SELECT COUNT(*) as count FROM chat_enquiries WHERE created_at >= ?", [sevenDaysAgo]);
    const [[{ count: portfolioCount }]] = await db.query("SELECT COUNT(*) as count FROM projects");
    const [[{ count: applicationsCount }]] = await db.query("SELECT COUNT(*) as count FROM applications");
    const [[{ count: newApplicationsCount }]] = await db.query("SELECT COUNT(*) as count FROM applications WHERE created_at >= ?", [sevenDaysAgo]);
    const [[{ count: contactEnquiriesCount }]] = await db.query("SELECT COUNT(*) AS count FROM contact_enquiries");

    res.json({
      applications: applicationsCount,
      messages: messages.length,
      chatEnquiries: chatEnquiriesCount,
      portfolio: portfolioCount,
      contactEnquiries: Number(contactEnquiriesCount),
      newApplications: newApplicationsCount,
      newMessages: messages.filter(
        (m) => Date.now() - new Date(m.createdAt).getTime() < 7 * 86400000,
      ).length,
      newChatEnquiries: chatEnquiriesNewCount,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Applications CRUD
app.get("/api/admin/applications", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM applications ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications", details: err.message });
  }
});

app.patch("/api/admin/applications/:id/status", authMiddleware, async (req, res) => {
  const { status } = req.body;
  if (!["new", "reviewed", "shortlisted", "rejected", "hired"].includes(status))
    return res.status(400).json({ error: "Invalid status" });

  try {
    const [rows] = await db.query("SELECT * FROM applications WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });

    await db.query("UPDATE applications SET status = ?, updated_at = NOW() WHERE id = ?", [status, req.params.id]);
    const [updated] = await db.query("SELECT * FROM applications WHERE id = ?", [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update application status", details: err.message });
  }
});

app.delete("/api/admin/applications/:id", authMiddleware, async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM applications WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete application", details: err.message });
  }
});

// Contact Messages CRUD
app.get("/api/admin/messages", authMiddleware, (req, res) => {
  const msgs = readJSON("messages.json", []);
  const sorted = msgs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sorted);
});

app.patch("/api/admin/messages/:id/read", authMiddleware, (req, res) => {
  const msgs = readJSON("messages.json", []);
  const idx = msgs.findIndex((m) => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });

  msgs[idx].read = !msgs[idx].read;
  msgs[idx].updatedAt = new Date().toISOString();
  writeJSON("messages.json", msgs);
  res.json(msgs[idx]);
});

app.delete("/api/admin/messages/:id", authMiddleware, (req, res) => {
  let msgs = readJSON("messages.json", []);
  msgs = msgs.filter((m) => m.id !== req.params.id);
  writeJSON("messages.json", msgs);
  res.json({ success: true });
});

app.get("/api/admin/chat-enquiries", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM chat_enquiries ORDER BY created_at DESC");
    const mapped = rows.map((e) => ({
      id: e.id,
      service: e.service,
      projectType: e.project_type,
      budget: e.budget,
      timeline: e.timeline,
      contact: {
        name: e.contact_name,
        business: e.contact_business,
        email: e.contact_email,
        phone: e.contact_phone,
        requirements: e.contact_requirements,
      },
      read: !!e.read,
      createdAt: e.created_at,
      updatedAt: e.updated_at,
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chat enquiries", details: err.message });
  }
});

app.patch("/api/admin/chat-enquiries/:id/read", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM chat_enquiries WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });

    const enquiry = rows[0];
    const newRead = !enquiry.read;
    await db.query("UPDATE chat_enquiries SET `read` = ? WHERE id = ?", [newRead, req.params.id]);

    res.json({
      id: enquiry.id,
      service: enquiry.service,
      projectType: enquiry.project_type,
      budget: enquiry.budget,
      timeline: enquiry.timeline,
      contact: {
        name: enquiry.contact_name,
        business: enquiry.contact_business,
        email: enquiry.contact_email,
        phone: enquiry.contact_phone,
        requirements: enquiry.contact_requirements,
      },
      read: newRead,
      createdAt: enquiry.created_at,
      updatedAt: enquiry.updated_at,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update enquiry", details: err.message });
  }
});

app.delete("/api/admin/chat-enquiries/:id", authMiddleware, async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM chat_enquiries WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete enquiry", details: err.message });
  }
});

// Portfolio CRUD (Admin)
app.get("/api/admin/portfolio", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM projects ORDER BY id DESC");
    const projects = rows.map(p => ({
      ...p,
      tags: p.tags ? p.tags.split(",").map(t => t.trim()) : [],
      images: p.images ? JSON.parse(p.images) : []
    }));
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.post(
  "/api/admin/portfolio",
  authMiddleware,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 20 }
  ]),
  async (req, res) => {
    try {
      const {
        slug,
        title,
        category,
        desc,
        tags,
        year,
        client,
        challenge,
        result
      } = req.body;

      if (!title || !category) {
        return res.status(400).json({
          error: "Title and Category are required"
        });
      }

      const finalSlug =
        slug ||
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      let coverImagePath = "";

      if (req.files?.coverImage?.[0]) {
        const fileName = `${Date.now()}-cover.webp`;

        await sharp(req.files.coverImage[0].buffer)
          .resize({
            width: 1200,
            fit: "inside",
            withoutEnlargement: true
          })
          .webp({
            quality: 75,
            effort: 6
          })
          .toFile(path.join(COVER_DIR, fileName));

        coverImagePath = `/uploads/covers/${fileName}`;
      }

      const galleryImages = [];

      if (req.files?.galleryImages) {
        for (const file of req.files.galleryImages) {
          const fileName =
            Date.now() +
            "-" +
            Math.random().toString(36).substring(2) +
            ".webp";

          await sharp(file.buffer)
            .resize({
              width: 1600,
              fit: "inside",
              withoutEnlargement: true
            })
            .webp({ quality: 80 })
            .toFile(path.join(GALLERY_DIR, fileName));

          galleryImages.push(
            `/uploads/gallery/${fileName}`
          );
        }
      }

      const tagsStr = tags || "";

      const [resultHeader] = await db.query(
        `INSERT INTO projects
        (slug,title,category,\`desc\`,image,tags,year,client,challenge,result,images,featured)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          finalSlug,
          title,
          category,
          desc || "",
          coverImagePath,
          tagsStr,
          year || "",
          client || "",
          challenge || "",
          result || "",
          JSON.stringify(galleryImages),
          req.body.featured || 0
        ]
      );

      res.status(201).json({
        id: resultHeader.insertId,
        slug: finalSlug,
        title,
        category,
        desc,
        image: coverImagePath,
        tags: tagsStr
          ? tagsStr.split(",").map(t => t.trim())
          : [],
        year,
        client,
        challenge,
        result,
        images: galleryImages
      });

    } catch (err) {
      res.status(500).json({
        error: "Server error",
        details: err.message
      });
    }
  }
);

app.delete("/api/admin/portfolio/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // First check if project exists
    const [rows] = await db.query("SELECT id, image FROM projects WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Delete the project from database
    const [result] = await db.query("DELETE FROM projects WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Failed to delete project" });
    }

    res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    console.error("Delete project error:", err);
    res.status(500).json({ error: "Failed to delete project", details: err.message });
  }
});

// ✅ 1. STATIC ROUTES FIRST
app.get("/api/projects/featured", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM projects WHERE featured = 1 ORDER BY id DESC LIMIT 6"
    );

    const formattedProjects = rows.map((project) => ({
      ...project,
      tags: project.tags ? project.tags.split(",").map((t) => t.trim()) : [],
      images: project.images ? JSON.parse(project.images) : [],
    }));

    res.json(formattedProjects);
  } catch (error) {
    console.error("Featured fetch error:", error);
    res.status(500).json({ error: "Failed to fetch featured projects", details: error.message });
  }
});

// ❌ 2. DYNAMIC PARAMETER ROUTES SECOND
app.get("/api/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM projects WHERE id = ? OR slug = ?", [id, id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.patch(
  "/api/admin/portfolio/:id",
  authMiddleware,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 20 }
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;

      const [rows] = await db.query("SELECT * FROM projects WHERE id = ?", [id]);
      if (rows.length === 0) return res.status(404).json({ error: "Not found" });

      const current = rows[0];

      const {
        slug,
        title,
        category,
        desc,
        tags,
        year,
        client,
        challenge,
        result,
        featured // Destructured correctly here
      } = req.body;

      let coverImagePath = current.image;

      // Safe JSON parsing guard
      let galleryImages = [];
      if (current.images) {
        try {
          galleryImages = JSON.parse(current.images);
        } catch (pErr) {
          galleryImages = []; // Fallback if string is malformed
        }
      }

      // ✅ HANDLE NEW COVER IMAGE (Requires Multer Memory Storage)
      if (req.files?.coverImage?.[0]) {
        const fileName = `${Date.now()}-cover.webp`;

        await sharp(req.files.coverImage[0].buffer)
          .resize({ width: 1200, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 75 })
          .toFile(path.join(COVER_DIR, fileName));

        coverImagePath = `/uploads/covers/${fileName}`;
      }

      // ✅ HANDLE NEW GALLERY IMAGES
      if (req.files?.galleryImages?.length) {
        for (const file of req.files.galleryImages) {
          const fileName =
            Date.now() + "-" + Math.random().toString(36).substring(2) + ".webp";

          await sharp(file.buffer)
            .resize({ width: 1600, fit: "inside", withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(path.join(GALLERY_DIR, fileName));

          galleryImages.push(`/uploads/gallery/${fileName}`);
        }
      }

      const finalSlug = slug !== undefined ? slug : current.slug;

      const finalTags =
        tags !== undefined
          ? (Array.isArray(tags) ? tags.join(", ") : tags)
          : current.tags;

      // Handle boolean / integer value for 'featured' fallback safely
      const finalFeatured = featured !== undefined ? featured : current.featured;

      await db.query(
        `UPDATE projects SET 
          slug=?,
          title=?,
          category=?,
          \`desc\`=?,
          image=?,
          tags=?,
          year=?,
          client=?,
          challenge=?,
          result=?,
          images=?,
          featured=? 
        WHERE id=?`,
        [
          finalSlug,
          title || current.title,
          category || current.category,
          desc || current.desc,
          coverImagePath,
          finalTags,
          year || current.year,
          client || current.client,
          challenge || current.challenge,
          result || current.result,
          JSON.stringify(galleryImages),
          finalFeatured, // Fixed: passing the correct variable here
          id,
        ]
      );

      res.json({
        id,
        slug: finalSlug,
        title: title || current.title,
        category: category || current.category,
        desc: desc || current.desc,
        image: coverImagePath,
        tags: finalTags
          ? finalTags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        year: year || current.year,
        client: client || current.client,
        challenge: challenge || current.challenge,
        result: result || current.result,
        images: galleryImages,
        featured: finalFeatured
      });

    } catch (err) {
      console.error("PATCH ERROR:", err); // Clear terminal indicator
      res.status(500).json({
        error: "Server error",
        details: err.message
      });
    }
  }
);

app.get("/api/admin/careers", authMiddleware, async (req, res) => {
  try {
    const categories = await getCareerJobsFromDb();
    res.json(categories);
  } catch (err) {
    console.error("Failed to load career jobs:", err);
    res.status(500).json({ error: "Failed to load career jobs", details: err.message });
  }
});

app.post("/api/admin/careers", authMiddleware, async (req, res) => {
  try {
    const { category, title, location, type, description } = req.body;
    if (!category || !title || !location || !type) {
      return res.status(400).json({ error: "Category, title, location, and type are required." });
    }

    const [existing] = await db.query(
      "SELECT id FROM career_jobs WHERE category = ? AND title = ?",
      [category, title]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: "This role already exists in that category." });
    }

    await db.query(
      "INSERT INTO career_jobs (category, title, location, type, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
      [category, title, location, type, description || ""]
    );

    const categories = await getCareerJobsFromDb();
    res.status(201).json({ success: true, categories });
  } catch (err) {
    console.error("Failed to save career job:", err);
    res.status(500).json({ error: "Failed to save career job", details: err.message });
  }
});

app.delete("/api/admin/careers", authMiddleware, async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Job id is required to delete a role." });
    }

    const [result] = await db.query("DELETE FROM career_jobs WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Role not found." });
    }

    const categories = await getCareerJobsFromDb();
    res.json({ success: true, categories });
  } catch (err) {
    console.error("Failed to delete career job:", err);
    res.status(500).json({ error: "Failed to delete career job", details: err.message });
  }
});

app.get("/api/admin/activity", authMiddleware, (req, res) => {
  res.json(readJSON("activity.json", []).slice(0, 50));
});

app.get("/api/admin/settings", authMiddleware, (req, res) => {
  res.json(readJSON("settings.json", { siteName: "Adway", contactEmail: "hello@adway.com" }));
});

app.patch("/api/admin/settings", authMiddleware, (req, res) => {
  writeJSON("settings.json", req.body);
  res.json(req.body);
});

/* ═══ PUBLIC API ROUTES ═══ */

const careerJobs = [
  {
    title: "Business Development",
    count: 3,
    roles: [
      {
        title: "Senior Brand Designer",
        location: "Remote / New York",
        type: "Full-time",
        description: "Lead brand systems, motion assets, and campaign design for flagship clients.",
      },
      {
        title: "Digital Product Designer",
        location: "Remote / New York",
        type: "Full-time",
        description: "Design product experiences for web and mobile that elevate brand storytelling.",
      },
      {
        title: "Motion Designer",
        location: "Remote",
        type: "Full-time",
        description: "Create motion content for digital campaigns, presentations, and immersive launches.",
      },
    ],
  },
  {
    title: "HR and Finance",
    count: 2,
    roles: [
      {
        title: "Brand Strategist",
        location: "Remote / London",
        type: "Full-time",
        description: "Shape long-term positioning and brand storytelling across client portfolios.",
      },
      {
        title: "Operations Manager",
        location: "New York",
        type: "Full-time",
        description: "Support growth operations, team coordination, and process optimization.",
      },
    ],
  },
  {
    title: "Data and Analytics",
    count: 2,
    roles: [
      {
        title: "Content Writer",
        location: "Remote",
        type: "Part-time",
        description: "Write persuasive copy for brand campaigns, pitch decks, and editorial content.",
      },
      {
        title: "Marketing Analyst",
        location: "Remote",
        type: "Full-time",
        description: "Analyze campaign performance and marketing data to drive growth decisions.",
      },
    ],
  },
];

const careerStats = [
  { number: "15", label: "Team Members" },
  { number: "5", label: "Countries" },
  { number: "97%", label: "Retention Rate" },
  { number: "4.8", label: "Rating" },
];

const careerPerks = [
  {
    title: "Health & Wellness",
    desc: "Full medical, dental, vision + mental health support",
  },
  {
    title: "Flexible Hours",
    desc: "Async-first culture with core overlap hours",
  },
  {
    title: "Learning Budget",
    desc: "$2,000/year for courses, conferences & growth",
  },
  {
    title: "Remote-First",
    desc: "Work from anywhere. Home-office stipend included",
  },
  {
    title: "Creative Culture",
    desc: "Design sprints, hack days & brainstorm sessions",
  },
  {
    title: "Team Retreats",
    desc: "Annual offsites, free swag & latest design tools",
  },
];

async function getCareerJobsFromDb() {
  const [jobs] = await db.query("SELECT * FROM career_jobs ORDER BY category ASC, created_at ASC");

  const categories = [];
  jobs.forEach((job) => {
    let category = categories.find((item) => item.title === job.category);
    if (!category) {
      category = { title: job.category, roles: [] };
      categories.push(category);
    }
    category.roles.push({
      id: job.id,
      title: job.title,
      location: job.location,
      type: job.type,
      description: job.description || "",
    });
  });

  return categories.map((category) => ({
    ...category,
    count: category.roles.length,
  }));
}

async function seedCareerJobsIfEmpty() {
  const [[{ count }]] = await db.query("SELECT COUNT(*) as count FROM career_jobs");
  if (count > 0) return;

  const entries = careerJobs.flatMap((category) =>
    category.roles.map((role) => ({
      category: category.title,
      title: role.title,
      location: role.location,
      type: role.type,
      description: role.description || "",
    })),
  );

  for (const entry of entries) {
    await db.query(
      "INSERT INTO career_jobs (category, title, location, type, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
      [entry.category, entry.title, entry.location, entry.type, entry.description]
    );
  }
}

async function seedProjectsIfEmpty() {
  const [[{ count }]] = await db.query("SELECT COUNT(*) as count FROM projects");
  if (count > 0) return;

  const backupProjects = readJSON("portfolio.json", []);
  for (const project of backupProjects) {
    const id = project.id || crypto.randomUUID();
    await db.query(
      `INSERT INTO projects (id, title, slug, category, image, tags, year, client, description, challenge, result, images, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        id,
        project.title || "Untitled",
        project.slug || project.title?.toLowerCase().replace(/\s+/g, "-") || id,
        project.category || "",
        project.image || "",
        Array.isArray(project.tags) ? project.tags.join(",") : "",
        project.year || "",
        project.client || "",
        project.desc || project.description || "",
        project.challenge || "",
        project.result || "",
        Array.isArray(project.images) ? JSON.stringify(project.images) : "[]",
      ]
    );
  }
}

async function seedClientsIfEmpty() {
  const [[{ count }]] = await db.query("SELECT COUNT(*) as count FROM clients");
  if (count > 0) return;

  const backupClients = readJSON("clients.json", []);
  for (const client of backupClients) {
    const id = client.id || crypto.randomUUID();
    await db.query(
      "INSERT INTO clients (id, name, logo, position, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
      [id, client.name || "Client", client.logo || "", client.position || 0]
    );
  }
}

app.get("/api/careers", async (req, res) => {
  try {
    res.json({ categories: await getCareerJobsFromDb(), stats: careerStats, perks: careerPerks });
  } catch (err) {
    console.error("Failed to load public career jobs:", err);
    res.status(500).json({ error: "Failed to load career jobs", details: err.message });
  }
});

app.post("/api/chatbot", async (req, res) => {
  const { message, history } = req.body || {};
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message text is required." });
  }

  try {
    const reply = await getChatbotReply(message, Array.isArray(history) ? history : []);
    res.json({ reply });
  } catch (err) {
    console.error("Chatbot request failed:", err);
    res.status(500).json({ error: "Failed to generate chatbot reply.", details: err.message });
  }
});

app.post("/api/chat-enquiries", async (req, res) => {
  const { service, projectType, budget, timeline, contact } = req.body || {};

  if (!service || !projectType || !budget || !timeline || !contact || !contact.name || !contact.email || !contact.phone) {
    return res.status(400).json({ error: "Required inquiry fields are missing." });
  }

  try {
    const id = crypto.randomUUID();
    await db.query(
      `INSERT INTO chat_enquiries (id, service, project_type, budget, timeline, contact_name, contact_business, contact_email, contact_phone, contact_requirements, \`read\`, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NOW(), NOW())`,
      [id, service, projectType, budget, timeline, contact.name, contact.business || "", contact.email, contact.phone, contact.requirements || ""]
    );

    res.status(201).json({
      success: true,
      enquiry: {
        id,
        service,
        projectType,
        budget,
        timeline,
        contact: {
          name: contact.name,
          business: contact.business || "",
          email: contact.email,
          phone: contact.phone,
          requirements: contact.requirements || "",
        },
        read: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("Chat enquiry save failed:", err);
    res.status(500).json({ error: "Failed to save inquiry.", details: err.message });
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT DISTINCT category FROM projects WHERE category IS NOT NULL");
    const dbCategories = rows.map((row) => row.category);
    res.json(["All", ...dbCategories]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories", details: error.message });
  }
});

app.get("/api/projects", async (req, res) => {
  try {
    const { category } = req.query;
    let rows;

    if (category && category !== "All") {
      [rows] = await db.query("SELECT * FROM projects WHERE category = ? ORDER BY id DESC", [category]);
    } else {
      [rows] = await db.query("SELECT * FROM projects ORDER BY id DESC");
    }

    const formattedProjects = rows.map((project) => ({
      ...project,
      tags: project.tags ? project.tags.split(",").map((t) => t.trim()) : [],
      images: project.images ? JSON.parse(project.images) : [],
    }));

    res.json(formattedProjects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects", details: error.message });
  }
});

app.get("/api/projects/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await db.query("SELECT * FROM projects WHERE slug = ? OR id = ?", [slug, slug]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const project = rows[0];
    // Parse tags and images properly
    project.tags = project.tags ? project.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
    project.images = project.images ? JSON.parse(project.images) : [];

    // Get all projects for navigation
    const [allProjects] = await db.query(
      "SELECT slug, title FROM projects ORDER BY id DESC"
    );
    const currentIndex = allProjects.findIndex((item) => item.slug === slug || item.id == slug);

    let prevProject = null;
    let nextProject = null;

    if (currentIndex > 0) {
      prevProject = allProjects[currentIndex - 1];
    }
    if (currentIndex < allProjects.length - 1) {
      nextProject = allProjects[currentIndex + 1];
    }

    res.json({ project, prevProject, nextProject });
  } catch (error) {
    console.error("Error fetching project details:", error);
    res.status(500).json({ error: "Failed to fetch project details", details: error.message });
  }
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn("⚠️  EMAIL_USER or EMAIL_PASS is not configured. Candidate confirmation emails will not be sent.");
}

console.log("📎 Mail config:", {
  EMAIL_USER: !!process.env.EMAIL_USER,
  EMAIL_PASS: !!process.env.EMAIL_PASS,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Error:", error);
  } else {
    console.log("✅ SMTP Server Ready", success ? "(verified)" : "");
  }
});

app.post("/api/applications", apiLimiter, resumeUpload.single("resume"), async (req, res) => {
  console.log("🔥 Application endpoint hit");
  console.log("Body:", req.body);
  const { name, email, position, phone, portfolio, linkedin, coverNote } = req.body;
  if (!name || !email || !position)
    return res.status(400).json({ error: "Name, email, and position are required" });

  let resumePath = "";
  if (req.file) {
    const safeName = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "-")}`;
    const filePath = path.join(RESUME_DIR, safeName);
    fs.writeFileSync(filePath, req.file.buffer);
    resumePath = `/uploads/resumes/${safeName}`;
  }

  try {
    // 2. Insert application into MySQL
    const appId = crypto.randomUUID();
    await db.query(
      `INSERT INTO applications (id, name, email, position, phone, portfolio, linkedin, coverNote, resume, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', NOW(), NOW())`,
      [appId, name, email, position, phone || "", portfolio || "", linkedin || "", coverNote || "", resumePath]
    );

    // 3. Trigger cloud workbook sync logic asynchronously in background (if configured)
    syncApplicationRecords().catch((syncErr) => {
      console.error("Background spreadsheet synchronization failed:", syncErr.message);
    });

    // 4. Draft the premium dark/minimal themed automated candidate email
    const confirmationEmail = {
      from: `"Adway Careers" <${process.env.EMAIL_USER}>`,
      to: email, // Candidate's email address
      subject: `Application Received — ${position}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 40px 32px; color: #111111; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="font-size: 20px; font-weight: 600; color: #111111; margin-bottom: 16px; letter-spacing: -0.02em;">Hi ${name},</h2>
          
          <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">
            Thank you for applying to join our team at Adway. We have safely received your submission data and files for the <strong>${position}</strong> opening.
          </p>
          
          <div style="background-color: #f9fafb; padding: 16px 20px; border-left: 3px solid #111111; margin-bottom: 24px; border-radius: 4px;">
            <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; font-weight: 600;">Submission Parameters</p>
            <p style="margin: 6px 0 0 0; font-size: 14px; color: #1f2937;"><strong>Target Position:</strong> ${position}</p>
          </div>

          <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin-bottom: 32px;">
            Our talent acquisition team evaluates applicant portfolios individually. If your expertise aligns with our current creative goals, we will follow up with you within 5–7 business days to arrange an interview.
          </p>

          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin-bottom: 20px;" />
          <p style="font-size: 11px; text-align: center; color: #9ca3af; margin: 0;">
            This automated verification was dispatched by Adway Systems.
          </p>
        </div>
      `,
    };

    console.log("🔔 Email attempt details:", {
      to: email,
      subject: confirmationEmail.subject,
      smtpUserConfigured: !!process.env.EMAIL_USER,
      smtpPassConfigured: !!process.env.EMAIL_PASS,
    });

    // 5. Send the confirmation email and include the result in the response for debugging
    let mailResult = null;
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        console.log("📤 Sending confirmation email...");
        const info = await transporter.sendMail(confirmationEmail);
        mailResult = { success: true, messageId: info.messageId };
        console.log(`✅ Confirmation email sent: ${info.messageId}`);
      } catch (mailError) {
        mailResult = { success: false, error: mailError.message };
        console.error("❌ Nodemailer routing failure:", mailError);
      }
    } else {
      mailResult = {
        success: false,
        error: "EMAIL_USER or EMAIL_PASS is not configured",
      };
      console.warn("⚠️ Skipping candidate confirmation email because EMAIL_USER or EMAIL_PASS is not configured.");
    }

    // 6. Respond immediately to the frontend application layout frame
    console.log("📣 Application response mail result:", mailResult);
    res.status(201).json({ success: true, id: appId, mail: mailResult });
  } catch (err) {
    console.error("Application routing system encountered an issue:", err);
    res.status(500).json({ error: "Failed to save application", details: err.message });
  }
});

app.post("/api/messages", apiLimiter, (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: "Name, email, and message are required" });

  const msgs = readJSON("messages.json", []);
  const msg = {
    id: crypto.randomUUID(),
    name,
    email,
    subject: subject || "",
    message,
    read: false,
    createdAt: new Date().toISOString(),
  };
  msgs.push(msg);
  writeJSON("messages.json", msgs);
  res.status(201).json({ success: true, id: msg.id });
});

/* ═══ SERVER & DB INITIALIZATION ═══ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`\n🚀 Adway Admin Server running on port ${PORT}`);
  console.log(`📧 Admin email: ${ADMIN_EMAIL}`);
  console.log(`🔑 JWT Secret: ${JWT_SECRET.substring(0, 12)}...`);
  console.log(`\n⚠️  Change ADMIN_EMAIL, ADMIN_PASS, JWT_SECRET in .env for production!\n`);

  try {
    // Verify MySQL connection
    await db.query("SELECT 1");
    console.log("✅ MySQL Connected successfully");

    // Ensure all tables exist
    await db.query(`CREATE TABLE IF NOT EXISTS applications (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      email VARCHAR(255) NOT NULL,
      position VARCHAR(150) NOT NULL,
      phone VARCHAR(50) DEFAULT '',
      portfolio VARCHAR(255) DEFAULT '',
      linkedin VARCHAR(255) DEFAULT '',
      coverNote TEXT,
      resume VARCHAR(255) DEFAULT '',
      status VARCHAR(50) NOT NULL DEFAULT 'new',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS career_jobs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category VARCHAR(100) NOT NULL,
      title VARCHAR(200) NOT NULL,
      location VARCHAR(100) NOT NULL,
      type VARCHAR(50) NOT NULL,
      description TEXT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY idx_category_title (category, title)
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS chat_enquiries (
      id VARCHAR(36) PRIMARY KEY,
      service VARCHAR(150) NOT NULL,
      project_type VARCHAR(150) NOT NULL,
      budget VARCHAR(100) NOT NULL,
      timeline VARCHAR(100) NOT NULL,
      contact_name VARCHAR(200) NOT NULL,
      contact_business VARCHAR(255) DEFAULT '',
      contact_email VARCHAR(255) NOT NULL,
      contact_phone VARCHAR(50) NOT NULL,
      contact_requirements TEXT DEFAULT NULL,
      \`read\` TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS clients (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      logo VARCHAR(500) DEFAULT NULL,
      position INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS blogs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(300) NOT NULL,
      slug VARCHAR(300) NOT NULL UNIQUE,
      excerpt VARCHAR(500) DEFAULT '',
      content LONGTEXT NOT NULL,
      coverImage VARCHAR(500) DEFAULT '',
      author VARCHAR(100) NOT NULL DEFAULT 'Adway Team',
      category VARCHAR(100) DEFAULT '',
      tags VARCHAR(500) DEFAULT '',
      readingTime INT DEFAULT 1,
      published TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_published (published),
      INDEX idx_category (category)
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS contact_enquiries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      email VARCHAR(255) NOT NULL,
      company VARCHAR(255) DEFAULT NULL,
      service VARCHAR(255) DEFAULT NULL,
      budget VARCHAR(255) DEFAULT NULL,
      message TEXT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);

    const adminUser = await ensureAdminUserInDatabase();
    console.log(`✅ Admin user ready: ${adminUser.email}`);

    console.log("✅ All tables ensured");

    // Seed starter data if the new Railway database is empty
    await seedCareerJobsIfEmpty();
    await seedProjectsIfEmpty();
    await seedClientsIfEmpty();

    console.log("✅ MySQL Initialized successfully");
  } catch (err) {
    console.error("❌ Database Connection Error:", err.message || err);
  }
});


app.post("/api/contact-enquiries", async (req, res) => {
  try {
    const { name, email, company, service, budget, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Name, email and message are required" });
    }
    await db.query(
      `INSERT INTO contact_enquiries (name, email, company, service, budget, message) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, company || null, service || null, budget || null, message]
    );
    res.status(201).json({ success: true, message: "Contact enquiry submitted successfully" });
  } catch (error) {
    console.error("CONTACT ENQUIRY ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/contact-enquiries", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM contact_enquiries ORDER BY createdAt DESC`);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/admin/contact-enquiries/:id", authMiddleware, async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM contact_enquiries WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/admin/stats/history", authMiddleware, async (req, res) => {
  try {
    const days = 7;
    const labels = [];
    const applications = [];
    const messages = [];
    const chat = [];
    const contact = [];

    const allMessages = readJSON("messages.json", []);

    for (let i = days - 1; i >= 0; i--) {
      const from = new Date();
      from.setDate(from.getDate() - i);
      from.setHours(0, 0, 0, 0);

      const to = new Date(from);
      to.setHours(23, 59, 59, 999);

      labels.push(from.toLocaleDateString("en-US", { weekday: "short" }));

      const [[{ count: appCount }]] = await db.query(
        "SELECT COUNT(*) as count FROM applications WHERE created_at BETWEEN ? AND ?",
        [from, to]
      );
      applications.push(appCount);

      const [[{ count: chatCount }]] = await db.query(
        "SELECT COUNT(*) as count FROM chat_enquiries WHERE created_at BETWEEN ? AND ?",
        [from, to]
      );
      chat.push(chatCount);

      const msgCount = allMessages.filter((m) => {
        const t = new Date(m.createdAt).getTime();
        return t >= from.getTime() && t <= to.getTime();
      }).length;
      messages.push(msgCount);

      const [[{ count: contactCount }]] = await db.query(
        "SELECT COUNT(*) AS count FROM contact_enquiries WHERE createdAt BETWEEN ? AND ?",
        [from, to]
      );
      contact.push(Number(contactCount));
    }

    res.json({ labels, applications, messages, chat, contact });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history", details: err.message });
  }
});


app.post("/api/admin/send-email", authMiddleware, async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    if (!to || !subject || !message) {
      return res.status(400).json({ error: "To, subject, and message are required." });
    }

    await transporter.sendMail({
      from: `"Adway Admin" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        <!-- Header --> <div style="padding:30px;text-align:center;border-bottom:1px solid #e5e7eb;"> <img src="${process.env.CLIENT_URL}/logo.png" alt="Adway Creations" style="height:40px;" /> </div> <!-- Content --> <div style="padding:40px 32px;"> <div style="font-size:15px;line-height:1.8;color:#374151;"> ${message.replace(/\n/g, "<br/>")} </div> </div> <!-- Footer --> <div style="padding:24px 32px;background:#fafafa;border-top:1px solid #e5e7eb;"> <p style="margin:0;font-size:14px;color:#4b5563;"> Regards,<br /> <strong>Adway Creations Team</strong> </p> <p style="margin:16px 0 0;font-size:12px;color:#9ca3af;"> © ${new Date().getFullYear()} Adway Creations. All rights reserved. </p> </div> </div> </div>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Send email error:", err);
    res.status(500).json({ error: err.message });
  }
});


/* ═══ BLOG API ═══ */

// Public: list published blogs
app.get("/api/blogs", async (req, res) => {
  try {
    const { category } = req.query;
    let sql = "SELECT id, title, slug, excerpt, coverImage, cover_image, author, category, tags, readingTime, reading_time, published, created_at, updated_at FROM blogs WHERE published = 1";
    const params = [];
    if (category && category !== "All") {
      sql += " AND category = ?";
      params.push(category);
    }
    sql += " ORDER BY created_at DESC";
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("Blog list error:", err);
    res.status(500).json({ error: "Failed to fetch blogs", details: err.message });
  }
});

// Public: blog categories
app.get("/api/blogs/categories", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT DISTINCT category FROM blogs WHERE published = 1 AND category IS NOT NULL AND category != ''"
    );
    const cats = rows.map((r) => r.category);
    res.json(["All", ...cats]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blog categories", details: err.message });
  }
});

// Public: single blog by slug
app.get("/api/blogs/:slug", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM blogs WHERE slug = ? AND published = 1", [req.params.slug]);
    if (rows.length === 0) return res.status(404).json({ error: "Blog post not found" });

    const blog = rows[0];

    // Navigation
    const [allBlogs] = await db.query(
      "SELECT slug, title FROM blogs WHERE published = 1 ORDER BY created_at DESC"
    );
    const idx = allBlogs.findIndex((b) => b.slug === req.params.slug);
    const prevBlog = idx > 0 ? allBlogs[idx - 1] : null;
    const nextBlog = idx < allBlogs.length - 1 ? allBlogs[idx + 1] : null;

    res.json({ blog, prevBlog, nextBlog });
  } catch (err) {
    console.error("Blog detail error:", err);
    res.status(500).json({ error: "Failed to fetch blog", details: err.message });
  }
});

// Admin: list all blogs (including drafts)
app.get("/api/admin/blogs", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM blogs ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs", details: err.message });
  }
});

// Admin: create blog
app.post("/api/admin/blogs", authMiddleware, upload.single("coverImage"), async (req, res) => {
  try {
    const { title, excerpt, content, author, category, tags, published } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") + "-" + Date.now();

    let coverImagePath = "";
    if (req.file) {
      const fileName = `${Date.now()}-blog.webp`;
      await sharp(req.file.buffer)
        .resize({ width: 1200, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(path.join(BLOG_DIR, fileName));
      coverImagePath = `/uploads/blogs/${fileName}`;
    }

    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const [result] = await db.query(
      `INSERT INTO blogs (title, slug, excerpt, content, coverImage, author, category, tags, readingTime, published, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [title, slug, excerpt || content.substring(0, 200), content, coverImagePath, author || "Adway Team", category || "", tags || "", readingTime, published ? 1 : 0]
    );

    const [newBlog] = await db.query("SELECT * FROM blogs WHERE id = ?", [result.insertId]);
    res.status(201).json(newBlog[0]);
  } catch (err) {
    console.error("Blog create error:", err);
    res.status(500).json({ error: "Failed to create blog", details: err.message });
  }
});

// Admin: update blog
app.patch("/api/admin/blogs/:id", authMiddleware, upload.single("coverImage"), async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM blogs WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Blog not found" });

    const blog = rows[0];
    const { title, excerpt, content, author, category, tags, published } = req.body;

    let coverImagePath = blog.coverImage;
    if (req.file) {
      const fileName = `${Date.now()}-blog.webp`;
      await sharp(req.file.buffer)
        .resize({ width: 1200, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(path.join(BLOG_DIR, fileName));
      coverImagePath = `/uploads/blogs/${fileName}`;
    }

    const finalTitle = title !== undefined ? title : blog.title;
    const finalExcerpt = excerpt !== undefined ? excerpt : blog.excerpt;
    const finalContent = content !== undefined ? content : blog.content;
    const finalAuthor = author !== undefined ? author : blog.author;
    const finalCategory = category !== undefined ? category : blog.category;
    const finalTags = tags !== undefined ? tags : blog.tags;
    const finalPublished = published !== undefined ? (published ? 1 : 0) : blog.published;
    const finalReadingTime = content !== undefined
      ? Math.max(1, Math.ceil(finalContent.split(/\s+/).length / 200))
      : blog.readingTime;

    await db.query(
      `UPDATE blogs SET title=?, excerpt=?, content=?, coverImage=?, author=?, category=?, tags=?, readingTime=?, published=?, updated_at=NOW() WHERE id=?`,
      [finalTitle, finalExcerpt, finalContent, coverImagePath, finalAuthor, finalCategory, finalTags, finalReadingTime, finalPublished, req.params.id]
    );

    const [updated] = await db.query("SELECT * FROM blogs WHERE id = ?", [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    console.error("Blog update error:", err);
    res.status(500).json({ error: "Failed to update blog", details: err.message });
  }
});

// Admin: delete blog
app.delete("/api/admin/blogs/:id", authMiddleware, async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM blogs WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Blog not found" });
    res.json({ success: true });
  } catch (err) {
    console.error("Blog delete error:", err);
    res.status(500).json({ error: "Failed to delete blog", details: err.message });
  }
});

module.exports = app;

/* ═══ CLIENTS API ═══ */

// Public: fetch all clients ordered by position
app.get("/api/clients", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM clients ORDER BY position ASC, created_at ASC");
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch clients:", err);
    res.status(500).json({ error: "Failed to fetch clients", details: err.message });
  }
});

// Admin: fetch all clients (auth required)
app.get("/api/admin/clients", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM clients ORDER BY position ASC, created_at ASC");
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch admin clients:", err);
    res.status(500).json({ error: "Failed to fetch clients", details: err.message });
  }
});

// Admin: create client with optional logo upload
app.post("/api/admin/clients", authMiddleware, upload.single("logo"), async (req, res) => {
  try {
    const { name, position } = req.body;
    if (!name) return res.status(400).json({ error: "Client name is required" });

    let logoPath = "";
    if (req.file) {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`;
      await sharp(req.file.buffer)
        .resize({ width: 400, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(path.join(LOGO_DIR, fileName));
      logoPath = `/uploads/logos/${fileName}`;
    }

    const [[{ max: maxPos }]] = await db.query("SELECT MAX(position) as max FROM clients");
    const finalPosition = position !== undefined && position !== "" ? Number(position) : (maxPos || 0) + 1;

    const [result] = await db.query(
      "INSERT INTO clients (name, logo, position, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
      [name, logoPath, finalPosition]
    );

    const [newClient] = await db.query("SELECT * FROM clients WHERE id = ?", [result.insertId]);
    res.status(201).json(newClient[0]);
  } catch (err) {
    console.error("Create client error:", err);
    res.status(500).json({ error: "Failed to create client", details: err.message });
  }
});

// Admin: update client
app.patch("/api/admin/clients/:id", authMiddleware, upload.single("logo"), async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM clients WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Client not found" });

    const client = rows[0];
    const { name, position } = req.body;
    let logoPath = client.logo;

    if (req.file) {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`;
      await sharp(req.file.buffer)
        .resize({ width: 400, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(path.join(LOGO_DIR, fileName));
      logoPath = `/uploads/logos/${fileName}`;
    }

    const finalName = name !== undefined ? name : client.name;
    const finalPosition = position !== undefined && position !== "" ? Number(position) : client.position;

    await db.query(
      "UPDATE clients SET name = ?, logo = ?, position = ?, updated_at = NOW() WHERE id = ?",
      [finalName, logoPath, finalPosition, req.params.id]
    );

    const [updated] = await db.query("SELECT * FROM clients WHERE id = ?", [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    console.error("Update client error:", err);
    res.status(500).json({ error: "Failed to update client", details: err.message });
  }
});

// Admin: delete client
app.delete("/api/admin/clients/:id", authMiddleware, async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM clients WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Client not found" });
    res.json({ success: true });
  } catch (err) {
    console.error("Delete client error:", err);
    res.status(500).json({ error: "Failed to delete client", details: err.message });
  }
});

