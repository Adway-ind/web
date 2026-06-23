const supabase = require("../../lib/supabase");

module.exports = async (req, res) => {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { id } = req.query;

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .or(`id.eq.${id},slug.eq.${id}`);

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const project = data[0];
    project.tags = project.tags ? project.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
    project.images = Array.isArray(project.images) ? project.images : [];

    // Get all projects for navigation
    const { data: allProjects } = await supabase
      .from("projects")
      .select("slug, title")
      .order("id", { ascending: false });

    const currentIndex = (allProjects || []).findIndex(
      (item) => item.slug === id || item.id == id
    );

    let prevProject = null;
    let nextProject = null;

    if (currentIndex > 0) {
      prevProject = allProjects[currentIndex - 1];
    }
    if (currentIndex < allProjects.length - 1) {
      nextProject = allProjects[currentIndex + 1];
    }

    res.json({ project, prevProject, nextProject });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch project details", details: err.message });
  }
};
