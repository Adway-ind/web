const supabase = require("../../lib/supabase");

module.exports = async (req, res) => {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("featured", true)
      .order("id", { ascending: false })
      .limit(6);

    if (error) throw error;

    const projects = (data || []).map((p) => ({
      ...p,
      tags: p.tags ? p.tags.split(",").map((t) => t.trim()) : [],
      images: Array.isArray(p.images) ? p.images : [],
    }));

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch featured projects", details: err.message });
  }
};
