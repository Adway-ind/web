const { withAuth } = require("../../../lib/auth");
const supabase = require("../../../lib/supabase");

module.exports = withAuth(async (req, res) => {
  if (req.method !== "DELETE") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { id } = req.query;
    const { error } = await supabase.from("contact_enquiries").delete().eq("id", id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
