require("dotenv").config();
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES = "2h";

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(header.split(" ")[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * Wraps a serverless handler with auth protection.
 * Usage: export default withAuth(async (req, res) => { ... })
 */
function withAuth(handler) {
  return async (req, res) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const decoded = jwt.verify(header.split(" ")[1], JWT_SECRET);
      req.user = decoded;
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    return handler(req, res);
  };
}

module.exports = { signToken, authMiddleware, withAuth, JWT_SECRET };
