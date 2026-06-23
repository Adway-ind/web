const supabase = require("../../lib/supabase");

module.exports = async (req, res) => {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { slug } = req.query;

    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .eq("published", true);

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    const blog = data[0];

    // Navigation
    const { data: allBlogs } = await supabase
      .from("blogs")
      .select("slug, title")
      .eq("published", true)
      .order("created_at", { ascending: false });

    const idx = (allBlogs || []).findIndex((b) => b.slug === slug);
    const prevBlog = idx > 0 ? allBlogs[idx - 1] : null;
    const nextBlog = idx < allBlogs.length - 1 ? allBlogs[idx + 1] : null;

    res.json({ blog, prevBlog, nextBlog });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blog", details: err.message });
  }
};
