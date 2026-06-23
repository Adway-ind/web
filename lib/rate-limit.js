/**
 * Simple in-memory rate limiter for serverless functions.
 * Since each serverless invocation is isolated, this provides
 * basic per-request protection. For distributed rate limiting,
 * use Upstash Redis or Vercel KV.
 */

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Creates a rate limiter middleware for Vercel serverless.
 * Uses a simple Map that resets on each cold start.
 */
function createRateLimiter({ windowMs = WINDOW_MS, max = 100 } = {}) {
  const hits = new Map();

  return (req, res, next) => {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
    const now = Date.now();
    const record = hits.get(ip);

    if (!record || now - record.start > windowMs) {
      hits.set(ip, { start: now, count: 1 });
      return next();
    }

    record.count++;
    if (record.count > max) {
      return res.status(429).json({ error: "Too many requests. Try again later." });
    }

    next();
  };
}

const authLimiter = createRateLimiter({ max: 10 });
const apiLimiter = createRateLimiter({ max: 100 });

module.exports = { createRateLimiter, authLimiter, apiLimiter };
