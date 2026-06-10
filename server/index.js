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

const db = require("./config/db");
const { sequelize, Application, CareerJob, ChatEnquiry, Client } = require("./models");

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

async function importChatbotEnquiriesFromJson() {
  const enquiries = readChatbotEnquiries();
  if (!Array.isArray(enquiries) || enquiries.length === 0) return;

  for (const enquiry of enquiries) {
    try {
      if (!enquiry.id) continue;
      const existing = await ChatEnquiry.findByPk(enquiry.id);
      if (existing) continue;

      await ChatEnquiry.create({
        id: enquiry.id,
        service: enquiry.service || "",
        project_type: enquiry.projectType || "",
        budget: enquiry.budget || "",
        timeline: enquiry.timeline || "",
        contact_name: enquiry.contact?.name || "",
        contact_business: enquiry.contact?.business || "",
        contact_email: enquiry.contact?.email || "",
        contact_phone: enquiry.contact?.phone || "",
        contact_requirements: enquiry.contact?.requirements || "",
        read: enquiry.read || false,
        created_at: enquiry.createdAt ? new Date(enquiry.createdAt) : undefined,
        updated_at: enquiry.updatedAt ? new Date(enquiry.updatedAt) : undefined,
      });
    } catch (err) {
      console.error("Failed to import chatbot enquiry:", err);
    }
  }
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
  return Application.findAll({ order: [[sequelize.col("created_at"), "DESC"]] });
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
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@adway.com";
const ADMIN_PASS = process.env.ADMIN_PASS || "Adway@2026!";
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString("hex");
const JWT_EXPIRES = "2h";

// Ensure admin user exists
function getAdminUser() {
  const users = readJSON("users.json", []);
  let admin = users.find((u) => u.role === "admin");
  if (!admin) {
    const hashed = bcrypt.hashSync(ADMIN_PASS, 12);
    admin = {
      id: crypto.randomUUID(),
      email: ADMIN_EMAIL,
      password: hashed,
      role: "admin",
      createdAt: new Date().toISOString(),
    };
    users.push(admin);
    writeJSON("users.json", users);
  }
  return admin;
}
getAdminUser();

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
    const chatEnquiriesCount = await ChatEnquiry.count();
    const chatEnquiriesNewCount = await ChatEnquiry.count({
      where: {
        created_at: {
          [require("sequelize").Op.gte]: new Date(Date.now() - 7 * 86400000),
        },
      },
    });
    const [portfolioRows] = await db.query("SELECT COUNT(*) as count FROM projects");
    const portfolioCount = portfolioRows[0].count;
    const applicationsCount = await Application.count();
    const newApplicationsCount = await Application.count({
      where: {
        created_at: {
          [require("sequelize").Op.gte]: new Date(Date.now() - 7 * 86400000),
        },
      },
    });

    // ✅ ADDED: contact enquiries count
    const [contactRows] = await db.query(
      "SELECT COUNT(*) AS count FROM contact_enquiries"
    );
    const contactEnquiriesCount = Number(contactRows[0].count);

    res.json({
      applications: applicationsCount,
      messages: messages.length,
      chatEnquiries: chatEnquiriesCount,
      portfolio: portfolioCount,
      contactEnquiries: contactEnquiriesCount, // ✅ now included
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
    const apps = await Application.findAll({ order: [[sequelize.col("created_at"), "DESC"]] });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications", details: err.message });
  }
});

app.patch("/api/admin/applications/:id/status", authMiddleware, async (req, res) => {
  const { status } = req.body;
  if (!["new", "reviewed", "shortlisted", "rejected", "hired"].includes(status))
    return res.status(400).json({ error: "Invalid status" });

  try {
    const application = await Application.findByPk(req.params.id);
    if (!application) return res.status(404).json({ error: "Not found" });

    application.status = status;
    await application.save();
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: "Failed to update application status", details: err.message });
  }
});

app.delete("/api/admin/applications/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Application.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
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
    const enquiries = await ChatEnquiry.findAll({ order: [["created_at", "DESC"]] });
    const mapped = enquiries.map((enquiry) => ({
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
      read: enquiry.read,
      createdAt: enquiry.created_at,
      updatedAt: enquiry.updated_at,
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chat enquiries", details: err.message });
  }
});

app.patch("/api/admin/chat-enquiries/:id/read", authMiddleware, async (req, res) => {
  try {
    const enquiry = await ChatEnquiry.findByPk(req.params.id);
    if (!enquiry) return res.status(404).json({ error: "Not found" });

    enquiry.read = !enquiry.read;
    await enquiry.save();
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
      read: enquiry.read,
      createdAt: enquiry.created_at,
      updatedAt: enquiry.updated_at,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update enquiry", details: err.message });
  }
});

app.delete("/api/admin/chat-enquiries/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await ChatEnquiry.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
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

    const existing = await CareerJob.findOne({
      where: {
        category,
        title,
      },
    });

    if (existing) {
      return res.status(409).json({ error: "This role already exists in that category." });
    }

    await CareerJob.create({
      category,
      title,
      location,
      type,
      description: description || "",
    });

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

    const deletedCount = await CareerJob.destroy({ where: { id } });
    if (!deletedCount) {
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
  const jobs = await CareerJob.findAll({
    raw: true,
    order: [
      ["category", "ASC"],
      ["created_at", "ASC"],
    ],
  });

  const categories = [];
  jobs.forEach((job) => {
    let category = categories.find((item) => item.title === job.category);
    if (!category) {
      category = {
        title: job.category,
        roles: [],
      };
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
  const remaining = await CareerJob.count();
  if (remaining > 0) return;

  const entries = careerJobs.flatMap((category) =>
    category.roles.map((role) => ({
      category: category.title,
      title: role.title,
      location: role.location,
      type: role.type,
      description: role.description || "",
    })),
  );

  if (entries.length) {
    await CareerJob.bulkCreate(entries);
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
    const enquiry = await ChatEnquiry.create({
      service,
      project_type: projectType,
      budget,
      timeline,
      contact_name: contact.name,
      contact_business: contact.business || "",
      contact_email: contact.email,
      contact_phone: contact.phone,
      contact_requirements: contact.requirements || "",
    });

    res.status(201).json({
      success: true,
      enquiry: {
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
        read: enquiry.read,
        createdAt: enquiry.created_at,
        updatedAt: enquiry.updated_at,
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
    // 2. Commit application to the local Sequelize Database
    const application = await Application.create({
      name,
      email,
      position,
      phone: phone || "",
      portfolio: portfolio || "",
      linkedin: linkedin || "",
      coverNote: coverNote || "",
      resume: resumePath,
      status: "new",
    });

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
    res.status(201).json({ success: true, id: application.id, mail: mailResult });
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

  // Run DB check safely now that server is listening
  try {
    if (db && typeof db.query === 'function') {
      await db.query("SELECT 1");
    } else if (db && db.pool && typeof db.pool.query === 'function') {
      await db.pool.query("SELECT 1");
    } else {
      throw new Error("The 'db' export is not a valid modern Promise pool setup.");
    }

    await sequelize.authenticate();
    await Application.sync();
    await CareerJob.sync();
    await ChatEnquiry.sync();
    await Client.sync();
    await importChatbotEnquiriesFromJson();
    await seedCareerJobsIfEmpty();

    console.log("✅ MySQL Connected successfully");
    console.log("✅ Sequelize authenticated and tables synced");
  } catch (err) {
    console.error("❌ Database Connection Warning:", err.message || err);
    console.log("👉 Please confirm your ./config/db file exports a clean mysql2/promise pool pool instance and your Sequelize config matches your DB.");
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

      const appCount = await Application.count({
        where: { created_at: { [require("sequelize").Op.between]: [from, to] } },
      });
      applications.push(appCount);

      const chatCount = await ChatEnquiry.count({
        where: { created_at: { [require("sequelize").Op.between]: [from, to] } },
      });
      chat.push(chatCount);

      const msgCount = allMessages.filter((m) => {
        const t = new Date(m.createdAt).getTime();
        return t >= from.getTime() && t <= to.getTime();
      }).length;
      messages.push(msgCount);

      const [contactRows] = await db.query(
        `SELECT COUNT(*) AS count FROM contact_enquiries WHERE createdAt BETWEEN ? AND ?`,
        [from, to]
      );
      contact.push(Number(contactRows[0].count));
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
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 40px 32px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px;">
          <div style="margin-bottom: 32px;">
            <img src="${process.env.CLIENT_URL}/logo.png" alt="Adway" style="height: 32px;" onerror="this.style.display='none'" />
          </div>
          <div style="font-size: 15px; line-height: 1.7; color: #374151; white-space: pre-wrap;">${message.replace(/\n/g, "<br/>")}</div>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 32px 0 20px;" />
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">Sent via Adway Admin · <a href="${process.env.CLIENT_URL}" style="color: #9ca3af;">${process.env.CLIENT_URL}</a></p>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Send email error:", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = app;

/* ═══ CLIENTS API ═══ */

// Public: fetch all clients ordered by position
app.get("/api/clients", async (req, res) => {
  try {
    const clients = await Client.findAll({ order: [["position", "ASC"], ["created_at", "ASC"]] });
    res.json(clients);
  } catch (err) {
    console.error("Failed to fetch clients:", err);
    res.status(500).json({ error: "Failed to fetch clients", details: err.message });
  }
});

// Admin: fetch all clients (auth required)
app.get("/api/admin/clients", authMiddleware, async (req, res) => {
  try {
    const clients = await Client.findAll({ order: [["position", "ASC"], ["created_at", "ASC"]] });
    res.json(clients);
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

    const maxPos = await Client.max("position") || 0;
    const client = await Client.create({
      name,
      logo: logoPath,
      position: position !== undefined && position !== "" ? Number(position) : maxPos + 1,
    });

    res.status(201).json(client);
  } catch (err) {
    console.error("Create client error:", err);
    res.status(500).json({ error: "Failed to create client", details: err.message });
  }
});

// Admin: update client
app.patch("/api/admin/clients/:id", authMiddleware, upload.single("logo"), async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ error: "Client not found" });

    const { name, position } = req.body;

    if (req.file) {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`;
      await sharp(req.file.buffer)
        .resize({ width: 400, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(path.join(LOGO_DIR, fileName));
      client.logo = `/uploads/logos/${fileName}`;
    }

    if (name !== undefined) client.name = name;
    if (position !== undefined && position !== "") client.position = Number(position);

    await client.save();
    res.json(client);
  } catch (err) {
    console.error("Update client error:", err);
    res.status(500).json({ error: "Failed to update client", details: err.message });
  }
});

// Admin: delete client
app.delete("/api/admin/clients/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Client.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Client not found" });
    res.json({ success: true });
  } catch (err) {
    console.error("Delete client error:", err);
    res.status(500).json({ error: "Failed to delete client", details: err.message });
  }
});

