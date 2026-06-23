const { withAuth } = require("../../lib/auth");
const supabase = require("../../lib/supabase");

module.exports = withAuth(async (req, res) => {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { data, error } = await supabase
      .from("chat_enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chat enquiries", details: err.message });
  }
});
