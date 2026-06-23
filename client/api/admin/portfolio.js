const { withAuth } = require("../../lib/auth");
const supabase = require("../../lib/supabase");

module.exports = withAuth(async (req, res) => {
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;

      const projects = (data || []).map((p) => ({
        ...p,
        tags: p.tags ? p.tags.split(",").map((t) => t.trim()) : [],
        images: Array.isArray(p.images) ? p.images : [],
      }));

      res.json(projects);
    } catch (err) {
      res.status(500).json({ error: "Server error", details: err.message });
    }
  } else if (req.method === "POST") {
    try {
      const {
        slug, title, category, desc, tags, year, client,
        challenge, result, coverImageUrl, galleryUrls, featured,
      } = req.body;

      if (!title || !category) {
        return res.status(400).json({ error: "Title and Category are required" });
      }

      const finalSlug =
        slug ||
        title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      const tagsStr = Array.isArray(tags) ? tags.join(", ") : (tags || "");
      const galleryImages = galleryUrls || [];

      const { data, error } = await supabase
        .from("projects")
        .insert({
          slug: finalSlug,
          title,
          category,
          desc: desc || "",
          image: coverImageUrl || "",
          tags: tagsStr,
          year: year || "",
          client: client || "",
          challenge: challenge || "",
          result: result || "",
          images: galleryImages,
          featured: featured || false,
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        ...data,
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
      });
    } catch (err) {
      res.status(500).json({ error: "Server error", details: err.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
});
