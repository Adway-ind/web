const { withAuth } = require("../../lib/auth");
const supabase = require("../../lib/supabase");

module.exports = withAuth(async (req, res) => {
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch blogs", details: err.message });
    }
  } else if (req.method === "POST") {
    try {
      const { title, excerpt, content, author, category, tags, published, coverImageUrl } = req.body;
      if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
      }

      const slug =
        title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();

      const wordCount = content.split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));

      const { data, error } = await supabase
        .from("blogs")
        .insert({
          title, slug,
          excerpt: excerpt || content.substring(0, 200),
          content,
          coverImage: coverImageUrl || "",
          author: author || "Adway Team",
          category: category || "",
          tags: tags || "",
          readingTime,
          published: published ? true : false,
        })
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to create blog", details: err.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
});
