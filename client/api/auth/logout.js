const { withAuth } = require("../../lib/auth");

module.exports = withAuth(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  res.json({ success: true });
});
