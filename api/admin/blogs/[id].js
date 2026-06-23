const { withAuth } = require("../../../lib/auth");
const supabase = require("../../../lib/supabase");

module.exports = withAuth(async (req, res) => {
  const { id } = req.query;

  if (req.method === "PATCH") {
    try {
      const { data: blog } = await supabase.from("blogs").select("*").eq("id", id).single();
      if (!blog) return res.status(404).json({ error: "Blog not found" });

      const { title, excerpt, content, author, category, tags, published, coverImageUrl } = req.body;

      const finalTitle = title !== undefined ? title : blog.title;
      const finalExcerpt = excerpt !== undefined ? excerpt : blog.excerpt;
      const finalContent = content !== undefined ? content : blog.content;
      const finalAuthor = author !== undefined ? author : blog.author;
      const finalCategory = category !== undefined ? category : blog.category;
      const finalTags = tags !== undefined ? tags : blog.tags;
      const finalPublished = published !== undefined ? (published ? true : false) : blog.published;
      const finalReadingTime = content !== undefined
        ? Math.max(1, Math.ceil(finalContent.split(/\s+/).length / 200))
        : blog.readingTime;

      const { data, error } = await supabase
        .from("blogs")
        .update({
          title: finalTitle,
          excerpt: finalExcerpt,
          content: finalContent,
          coverImage: coverImageUrl || blog.coverImage,
          author: finalAuthor,
          category: finalCategory,
          tags: finalTags,
          readingTime: finalReadingTime,
          published: finalPublished,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to update blog", details: err.message });
    }
  } else if (req.method === "DELETE") {
    try {
      const { error } = await supabase.from("blogs").delete().eq("id", id);
      if (error) throw error;
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete blog", details: err.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
});
