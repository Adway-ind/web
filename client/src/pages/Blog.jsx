import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Clock, User, Tag } from "lucide-react";
import { API } from "../config/api";
import SEO from "../components/SEO";

const resolveImageUrl = (url) => {
  if (!url) return "";
  if (/^(?:https?:|blob:|data:)/.test(url)) return url;
  return `${API}${url}`;
};

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/api/blogs/categories`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setCategories(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const url =
      activeCategory === "All"
        ? `${API}/api/blogs`
        : `${API}/api/blogs?category=${encodeURIComponent(activeCategory)}`;
    fetch(url)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setBlogs(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const handleBlogClick = (slug) => {
    navigate(`/blog/${slug}`);
  };

  return (
    <>
      <SEO
        title="Blog - Insights & Stories | Adway"
        description="Explore insights, stories, and expert advice on branding, design, marketing, and creative strategy from the Adway team."
        keywords="blog, branding insights, design tips, marketing strategy, creative agency blog"
        url="/blog"
      />

      {/* Hero */}
      <section className="relative bg-black pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-4 mb-10">
            <span className="text-[11px] tracking-[0.12em] uppercase text-white/50">
              Adway Studio — Blog
            </span>
            <div className="flex-1 h-px bg-white/15" />
          </div>
          <h1
            className="font-medium text-white leading-[1.0] text-center tracking-[-0.03em]"
            style={{ fontVariationSettings: "'opsz' 144", fontSize: "clamp(52px, 8vw, 88px)" }}
          >
            Ideas that<br />
            move{" "}
            <em className="text-blue-500" style={{ fontStyle: "italic" }}>
              brands forward.
            </em>
          </h1>
          <p className="mt-6 text-white/50 text-center text-lg max-w-7xl leading-relaxed">
            Perspectives on branding, design, marketing, and the creative process from our team.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-black py-8 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-white text-black"
                    : "bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-white/30 text-lg">No blog posts yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog, i) => (
                <article
                  key={blog.id}
                  onClick={() => handleBlogClick(blog.slug)}
                  className="group cursor-pointer bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-500"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Cover Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.03]">
                    {blog.coverImage ? (
                      <img
                        src={resolveImageUrl(blog.coverImage)}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/[0.05] flex items-center justify-center">
                          <Tag className="w-5 h-5 text-white/20" />
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                        <ArrowUpRight className="w-4 h-4 text-black" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Meta */}
                    <div className="flex items-center gap-3 text-[11px] text-white/30 uppercase tracking-wider mb-3">
                      {blog.category && (
                        <span className="px-2 py-0.5 rounded bg-white/[0.06] text-white/50">
                          {blog.category}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {blog.readingTime || 1} min read
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-white text-lg font-semibold leading-snug mb-2 group-hover:text-blue-400 transition-colors duration-300">
                      {blog.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-white/40 text-sm leading-relaxed line-clamp-2">
                      {blog.excerpt}
                    </p>

                    {/* Author + Date */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/[0.08] flex items-center justify-center">
                          <User className="w-3 h-3 text-white/40" />
                        </div>
                        <span className="text-xs text-white/40">{blog.author}</span>
                      </div>
                      <span className="text-xs text-white/25">
                        {new Date(blog.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
