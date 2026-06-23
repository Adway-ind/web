import re
import os

with open(r'd:\adway_web\server\index.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Fix Multer and Local Storage
code = code.replace('const upload = multer({', 'const upload = multer({ storage: multer.memoryStorage(), ')
code = code.replace('const resumeUpload = multer({', 'const resumeUpload = multer({ storage: multer.memoryStorage(), ')
code = re.sub(r'const storage = multer\.diskStorage\(\{.*?\}\);\s*const upload = multer\(\{.*?\}\);', 'const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });', code, flags=re.DOTALL)

# 2. Replace fs.mkdirSync for uploads
code = re.sub(r'if \(\!fs\.existsSync\(COVER_DIR\)\) \{.*?\}', '', code, flags=re.DOTALL)
code = re.sub(r'if \(\!fs\.existsSync\(GALLERY_DIR\)\) \{.*?\}', '', code, flags=re.DOTALL)
code = re.sub(r'if \(\!fs\.existsSync\(RESUME_DIR\)\) \{.*?\}', '', code, flags=re.DOTALL)
code = re.sub(r'if \(\!fs\.existsSync\(LOGO_DIR\)\) \{.*?\}', '', code, flags=re.DOTALL)
code = re.sub(r'if \(\!fs\.existsSync\(BLOG_DIR\)\) \{.*?\}', '', code, flags=re.DOTALL)
code = re.sub(r'const DATA_DIR.*?\nif \(\!fs\.existsSync\(DATA_DIR\)\).*?\n', '', code, flags=re.DOTALL)

# 3. Replace JSON functions with DB calls
code = code.replace('''function readJSON(file, fallback = []) {
  const fp = path.join(DATA_DIR, file);
  if (!fs.existsSync(fp)) return fallback;
  return JSON.parse(fs.readFileSync(fp, "utf-8"));
}
function writeJSON(file, data) {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}''', '''// JSON functions removed for Serverless (Using DB)''')

code = code.replace('''function logActivity(action, userEmail, ip) {
  const activity = readJSON("activity.json", []);
  activity.unshift({
    action,
    user: userEmail,
    ip,
    time: new Date().toISOString(),
  });
  if (activity.length > 100) activity.length = 100;
  writeJSON("activity.json", activity);
}''', '''async function logActivity(action, userEmail, ip) {
  try {
    await db.query("INSERT INTO activity (action, user_email, ip) VALUES (?, ?, ?)", [action, userEmail, ip || ""]);
  } catch(e) { console.error("Activity log err:", e); }
}''')

code = re.sub(r'app\.get\("/api/admin/activity", authMiddleware, \(req, res\) => \{.*?\res\.json\(readJSON\("activity\.json", \[\]\)\.slice\(0, 50\)\);\s*\}\);', '''app.get("/api/admin/activity", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM activity ORDER BY time DESC LIMIT 50");
    res.json(rows.map(r => ({ action: r.action, user: r.user_email, ip: r.ip, time: r.time })));
  } catch(e) { res.status(500).json({error: e.message}); }
});''', code, flags=re.DOTALL)

# 4. Fix Stats logic reading messages.json
code = code.replace('const messages = readJSON("messages.json", []);', 'const [messages] = await db.query("SELECT * FROM messages");')
code = code.replace('const allMessages = readJSON("messages.json", []);', 'const [allMessages] = await db.query("SELECT * FROM messages");')

# 5. Fix Messages routes
code = re.sub(r'app\.get\("/api/admin/messages", authMiddleware, \(req, res\) => \{.*?\}\);', '''app.get("/api/admin/messages", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM messages ORDER BY created_at DESC");
    res.json(rows.map(m => ({...m, createdAt: m.created_at})));
  } catch(e) { res.status(500).json({error: e.message}); }
});''', code, flags=re.DOTALL)

code = re.sub(r'app\.patch\("/api/admin/messages/:id/read", authMiddleware, \(req, res\) => \{.*?\}\);', '''app.patch("/api/admin/messages/:id/read", authMiddleware, async (req, res) => {
  try {
    await db.query("UPDATE messages SET \\`read\\` = NOT \\`read\\`, updated_at = NOW() WHERE id = ?", [req.params.id]);
    res.json({success: true});
  } catch(e) { res.status(500).json({error: e.message}); }
});''', code, flags=re.DOTALL)

code = re.sub(r'app\.delete\("/api/admin/messages/:id", authMiddleware, \(req, res\) => \{.*?\}\);', '''app.delete("/api/admin/messages/:id", authMiddleware, async (req, res) => {
  try {
    await db.query("DELETE FROM messages WHERE id = ?", [req.params.id]);
    res.json({success: true});
  } catch(e) { res.status(500).json({error: e.message}); }
});''', code, flags=re.DOTALL)

code = re.sub(r'app\.post\("/api/messages", apiLimiter, \(req, res\) => \{.*?\}\);', '''app.post("/api/messages", apiLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    await db.query("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)", [name, email, message]);
    res.status(201).json({success: true});
  } catch(e) { res.status(500).json({error: e.message}); }
});''', code, flags=re.DOTALL)

# 6. Remove admin getAdminUser json writes
code = re.sub(r'// Ensure admin user exists.*?getAdminUser\(\);', '', code, flags=re.DOTALL)

# 7. Export app for Vercel instead of app.listen
code = re.sub(r'/\* ═══ SERVER & DB INITIALIZATION ═══ \*/.*?\}\);', 'module.exports = app;', code, flags=re.DOTALL)
code = code.replace('app.listen(PORT, async () => {', '')

# 8. Handle Resume Write
code = code.replace('fs.writeFileSync(filePath, req.file.buffer);', '/* Supabase upload handled separately */')

if not os.path.exists(r'd:\adway_web\client\api'):
    os.makedirs(r'd:\adway_web\client\api')

with open(r'd:\adway_web\client\api\index.js', 'w', encoding='utf-8') as f:
    f.write(code)
print('Successfully processed index.js for serverless.')
