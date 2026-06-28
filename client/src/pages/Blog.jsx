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
      .catch(() => { });
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
      .catch(() => { })
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, i) => (
                <article
                  key={blog.id}
                  onClick={() => handleBlogClick(blog.slug)}
                  className="group relative overflow-hidden rounded-[28px]
      border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03]
      backdrop-blur-xl cursor-pointer transition-all duration-700
      hover:-translate-y-3 hover:border-blue-500/40"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Glow */}
                  <div className="absolute -inset-px rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-blue-500/20 via-cyan-500/10 to-purple-500/20 blur-xl" />
                  </div>

                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    {blog.coverImage ? (
                      <img
                        src={resolveImageUrl(blog.coverImage)}
                        alt={blog.title}
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white/[0.03]">
                        <Tag className="w-10 h-10 text-white/20" />
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    {/* Category */}
                    {blog.category && (
                      <div className="absolute top-5 left-5">
                        <span className="rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1 text-xs uppercase tracking-[0.2em] text-white">
                          {blog.category}
                        </span>
                      </div>
                    )}

                    {/* Read Time */}
                    <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-3 py-1">
                      <Clock className="w-3 h-3 text-white/70" />
                      <span className="text-xs text-white/70">
                        {blog.readingTime || 1} min read
                      </span>
                    </div>

                    {/* Arrow */}
                    <div
                      className="absolute right-5 bottom-5 h-12 w-12 rounded-full
          bg-white text-black flex items-center justify-center
          scale-0 group-hover:scale-100 transition-all duration-500"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative p-7">
                    {/* Title */}
                    <h3
                      className="text-2xl font-semibold text-white mb-4
          leading-tight transition-colors duration-300
          group-hover:text-blue-400"
                    >
                      {blog.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-white/50 leading-relaxed line-clamp-3 mb-6">
                      {blog.excerpt}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full
              bg-gradient-to-br from-blue-500/30 to-cyan-500/30
              border border-white/10 flex items-center justify-center"
                        >
                          <User className="w-4 h-4 text-white/80" />
                        </div>

                        <div>
                          <p className="text-sm text-white">{blog.author}</p>
                          <p className="text-xs text-white/30">
                            {new Date(blog.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="overflow-hidden">
                        <span
                          className="inline-flex items-center gap-2 text-sm text-white/60
              group-hover:text-white transition-colors"
                        >
                          Read More
                          <ArrowUpRight className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </span>
                      </div>
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
