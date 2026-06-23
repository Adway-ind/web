const { withAuth } = require("../../../lib/auth");
const supabase = require("../../../lib/supabase");

module.exports = withAuth(async (req, res) => {
  const { id } = req.query;

  if (req.method === "PATCH") {
    try {
      const { data, error } = await supabase
        .from("messages")
        .update({ read: true })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to update message", details: err.message });
    }
  } else if (req.method === "DELETE") {
    try {
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw error;
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete message", details: err.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
});
