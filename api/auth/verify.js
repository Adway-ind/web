const { withAuth } = require("../../lib/auth");

module.exports = withAuth(async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  res.json({ valid: true, user: req.user });
});
