const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { signToken } = require("../../lib/auth");
const supabase = require("../../lib/supabase");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@adway.com";
const ADMIN_PASS = process.env.ADMIN_PASS || "Adway@2026!";

// Ensure admin user exists in Supabase
async function ensureAdminUser() {
  const { data: admin } = await supabase
    .from("users")
    .select("*")
    .eq("role", "admin")
    .limit(1)
    .single();

  if (!admin) {
    const hashed = bcrypt.hashSync(ADMIN_PASS, 12);
    await supabase.from("users").insert({
      id: crypto.randomUUID(),
      email: ADMIN_EMAIL,
      password: hashed,
      role: "admin",
    });
  }
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await ensureAdminUser();

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed", details: err.message });
  }
};
