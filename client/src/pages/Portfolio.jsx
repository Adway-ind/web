import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, SlidersHorizontal } from "lucide-react";
import Video from "../assets/video/portfolio-one.mp4";
import { API } from "../config/api";
import SEO from "../components/SEO";
import Client from "../components/ClientsSection";

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

  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

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
      <SEO
        title="Our Portfolio - Branding & Digital Projects | Adway"
        description="Explore Adway's portfolio of successful branding, digital marketing, and web development projects."
        keywords="portfolio, branding projects, digital marketing, web development portfolio, creative work"
        url="/portfolio"
      />

      {/* ── Hero ── */}
      <section className="relative bg-black pt-32 pb-20 overflow-hidden">
        {/* Background video — dimmed */}
        <video
          autoPlay muted loop playsInline preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        >
          <source src={Video} type="video/mp4" />
        </video>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          {/* Eyebrow rule */}
          <div className="flex items-center gap-4 mb-10">
            <span className="text-[11px] tracking-[0.12em] uppercase text-white/50">
              Adway Studio — Portfolio
            </span>
            <div className="flex-1 h-px bg-white/15" />
          </div>

          {/* Headline */}
          <h1
            className="font-medium text-center text-white leading-[1.0] tracking-[-0.03em]"
            style={{ fontVariationSettings: "'opsz' 144", fontSize: "clamp(52px, 8vw, 88px)" }}
          >
            Work that<br />
            speaks{" "}
            <em className="text-blue-500" style={{ fontStyle: "italic" }}>
              for itself.
            </em>
          </h1>

          <p className="mt-5 text-[15px] text-center text-white/50 leading-relaxed max-w-7xl  font-light">
            A curated selection of brands we've helped build, transform, and elevate.
          </p>

          {/* Stats + scroll hint */}
          
        </div>
      </section>

      {/* ── Filter + Grid ── */}
      <section className="bg-white pt-10 pb-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Filter bar */}
          <div className="flex items-center justify-between mb-0 pb-5 border-b border-black/15">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-3.5 h-3.5 text-black/50" />
              <div className="flex border border-black/15 rounded-[3px] overflow-hidden">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 text-[12px] tracking-[0.04em] font-medium border-r border-black/15 last:border-r-0 transition-all duration-150 ${
                      activeCategory === cat
                        ? "bg-black text-white hover:bg-black hover:text-white"
                        : "bg-transparent text-black hover:bg-white hover:text-black"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-[12px] text-white tracking-[0.04em]">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-5 h-5 border border-white border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 text-center">
            <p className="text-white/50 text-sm">No projects in this category yet.</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white/5">
              {projects.map((project) => {
                const projectTags = Array.isArray(project.tags)
                  ? project.tags
                  : typeof project.tags === "string"
                  ? project.tags.split(",").map((t) => t.trim()).filter(Boolean)
                  : [];

                return (
                  <Link
                    key={project.slug || project.id}
                    to={`/portfolio/${project.slug}`}
                    className="group relative bg-[#0a0a0a] hover:bg-[#141414] transition-colors duration-200 overflow-hidden flex flex-col"
                  >
                    {/* Arrow icon — top-right corner with highlight border on hover */}
                    <div className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full border-2 border-white/20 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/60 transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black group-hover:scale-110">
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-45" />
                    </div>

                    {/* Image — fixed height */}
                    <div className="relative overflow-hidden flex-shrink-0 h-[300px] md:h-[360px]">
                      <img
                        src={resolveImageUrl(project.image)}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>

                    {/* Content — fixed height bottom area */}
                    <div className="flex flex-col flex-1 min-h-[90px] px-5 pt-4 pb-4">
                      <span className="text-[10px] tracking-[0.1em] uppercase text-white/50 mb-1.5">
                        {project.category}
                      </span>
                      <h3 className="font-serif text-[17px] text-white leading-tight line-clamp-2">
                        {project.title}
                      </h3>

                      {/* <div className="mt-auto pt-3">
                        {projectTags.length > 0 && (
                          <div className="flex gap-1.5 flex-wrap">
                            {projectTags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] tracking-[0.06em] uppercase text-white/40 px-2 py-1 border border-white/15 rounded-[2px]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div> */}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <Client />

      {/* ── CTA ── */}
      {/* <section className="bg-black py-16 px-6 lg:px-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="font-serif text-[28px] md:text-[36px] text-white italic leading-tight">
              Like what you see?
            </h2>
            <p className="text-[13px] text-white/40 mt-2 font-light">
              Let's create something just as impressive for your brand.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/20 text-white text-[12px] tracking-[0.08em] uppercase rounded-[3px] hover:bg-white hover:text-black hover:border-white transition-all duration-200"
          >
            Start a project
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section> */}
    </>
  );
}