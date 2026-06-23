const supabase = require("../../lib/supabase");

module.exports = async (req, res) => {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { category } = req.query;
    let query = supabase
      .from("blogs")
      .select("id, title, slug, excerpt, coverImage, author, category, tags, readingTime, published, created_at, updated_at")
      .eq("published", true);

    if (category && category !== "All") {
      query = query.eq("category", category);
    }
    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs", details: err.message });
  }
};
