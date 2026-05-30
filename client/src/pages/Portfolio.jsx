import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Filter } from "lucide-react";
import Video from "../assets/video/portfolio-one.mp4";
import { API } from "../config/api";

const resolveImageUrl = (url) => {
  if (!url) return "";
  if (/^(?:https?:|blob:|data:)/.test(url)) return url;
  return `${API}${url}`;
};

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Fetch projects when category changes
  useEffect(() => {
    setLoading(true);
    const url =
      activeCategory === "All"
        ? `${API}/api/projects`
        : `${API}/api/projects?category=${encodeURIComponent(activeCategory)}`;

    fetch(url)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error fetching projects:", err))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-24 bg-black overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={Video} type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-2 bg-white/10 border border-white/20 text-white rounded-full text-sm font-medium mb-6">
            Our Portfolio
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-bold text-white leading-[1.05] tracking-[-0.02em]">
            Work that speaks
            <br />
            <span className="gradient-text">for itself</span>
          </h1>
          <p className="mt-6 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            Explore a curated selection of brands we've helped build, transform,
            and elevate to new heights.
          </p>
        </div>
      </section>

      {/* Filter + Projects */}
      <section className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            <Filter className="w-5 h-5 text-white/30 mr-2" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-white text-black shadow-lg"
                    : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-white/10 border-t-white/50 rounded-full animate-spin" />
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link
                to={`/portfolio/${project.slug}`}
                key={project.slug}
                className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/25 hover:shadow-xl transition-all duration-500"
              >
                {/* Project Image */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={resolveImageUrl(project.image)}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="px-5 py-2.5 bg-white rounded-full text-black text-sm font-semibold flex items-center gap-2 shadow-lg">
                      View Project
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
                {/* Info */}
                <div className="p-6">
                  <span className="text-white/50 text-sm font-medium">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1 group-hover:text-white/90 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-white/50 text-sm mt-2 leading-relaxed">
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-white/5 text-white/60 rounded-full text-xs font-medium border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          )}

          {!loading && projects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-white/30 text-lg">
                No projects found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Like what you see?
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Let's create something just as impressive for your brand.
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 mt-8 px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-white/90 transition-all duration-300 shadow-lg"
          >
            Start a Project
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  );
}
