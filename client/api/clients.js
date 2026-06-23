const supabase = require("../lib/supabase");

module.exports = async (req, res) => {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch clients", details: err.message });
  }
};
