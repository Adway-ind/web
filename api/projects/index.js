const supabase = require("../../lib/supabase");

module.exports = async (req, res) => {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { category } = req.query;
    let query = supabase.from("projects").select("*");

    if (category && category !== "All") {
      query = query.eq("category", category);
    }
    query = query.order("id", { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    const projects = (data || []).map((p) => ({
      ...p,
      tags: p.tags ? p.tags.split(",").map((t) => t.trim()) : [],
      images: Array.isArray(p.images) ? p.images : [],
    }));

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects", details: err.message });
  }
};
