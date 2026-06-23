const { withAuth } = require("../../../lib/auth");
const supabase = require("../../../lib/supabase");

module.exports = withAuth(async (req, res) => {
  const { id } = req.query;

  if (req.method === "DELETE") {
    try {
      const { data: project } = await supabase
        .from("projects")
        .select("id")
        .eq("id", id)
        .single();

      if (!project) return res.status(404).json({ error: "Project not found" });

      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;

      res.json({ success: true, message: "Project deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete project", details: err.message });
    }
  } else if (req.method === "PATCH") {
    try {
      const { data: current } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (!current) return res.status(404).json({ error: "Not found" });

      const {
        slug, title, category, desc, tags, year, client,
        challenge, result, coverImageUrl, galleryUrls, featured,
      } = req.body;

      const finalSlug = slug !== undefined ? slug : current.slug;
      const finalTags = tags !== undefined
        ? (Array.isArray(tags) ? tags.join(", ") : tags)
        : current.tags;
      const finalFeatured = featured !== undefined ? featured : current.featured;

      let galleryImages = [];
      if (current.images) {
        galleryImages = Array.isArray(current.images) ? current.images : [];
      }
      if (galleryUrls) {
        galleryImages = [...galleryImages, ...galleryUrls];
      }

      const { data, error } = await supabase
        .from("projects")
        .update({
          slug: finalSlug,
          title: title || current.title,
          category: category || current.category,
          desc: desc || current.desc,
          image: coverImageUrl || current.image,
          tags: finalTags,
          year: year || current.year,
          client: client || current.client,
          challenge: challenge || current.challenge,
          result: result || current.result,
          images: galleryImages,
          featured: finalFeatured,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      res.json({
        ...data,
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      });
    } catch (err) {
      res.status(500).json({ error: "Server error", details: err.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
});
