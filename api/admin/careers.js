const { withAuth } = require("../../lib/auth");
const { getCareerJobsFromDb } = require("../../lib/careers");
const supabase = require("../../lib/supabase");

module.exports = withAuth(async (req, res) => {
  if (req.method === "GET") {
    try {
      const categories = await getCareerJobsFromDb();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: "Failed to load career jobs", details: err.message });
    }
  } else if (req.method === "POST") {
    try {
      const { category, title, location, type, description } = req.body;
      if (!category || !title || !location || !type) {
        return res.status(400).json({ error: "Category, title, location, and type are required." });
      }

      const { data: existing } = await supabase
        .from("career_jobs")
        .select("id")
        .eq("category", category)
        .eq("title", title)
        .limit(1);

      if (existing && existing.length > 0) {
        return res.status(409).json({ error: "This role already exists in that category." });
      }

      await supabase.from("career_jobs").insert({
        category, title, location, type, description: description || "",
      });

      const categories = await getCareerJobsFromDb();
      res.status(201).json({ success: true, categories });
    } catch (err) {
      res.status(500).json({ error: "Failed to save career job", details: err.message });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: "Job id is required to delete a role." });

      const { error } = await supabase.from("career_jobs").delete().eq("id", id);
      if (error) throw error;

      const categories = await getCareerJobsFromDb();
      res.json({ success: true, categories });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete career job", details: err.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
});
