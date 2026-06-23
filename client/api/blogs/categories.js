const supabase = require("../../lib/supabase");

module.exports = async (req, res) => {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("category")
      .eq("published", true)
      .not("category", "is", null);

    if (error) throw error;

    const cats = [...new Set((data || []).map((r) => r.category).filter(Boolean))];
    res.json(["All", ...cats]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blog categories", details: err.message });
  }
};
