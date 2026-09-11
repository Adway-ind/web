import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Clock, User, Tag } from "lucide-react";
import { API } from "../config/api";
import { Helmet } from "react-helmet-async";

/**
 * Resolve image URL
 *
 * Supports:
 * - Full URLs: https://...
 * - Blob URLs
 * - Data URLs
 * - Relative paths: /uploads/...
 * - Relative paths without leading slash
 */
const resolveImageUrl = (url) => {
  if (!url) return "";

  const imageUrl = String(url).trim();

  if (!imageUrl) return "";

  // Already a complete URL
  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://") ||
    imageUrl.startsWith("blob:") ||
    imageUrl.startsWith("data:")
  ) {
    return imageUrl;
  }

  // Remove duplicate slash between API and path
  const cleanApi = String(API || "").replace(/\/+$/, "");
  const cleanPath = imageUrl.startsWith("/")
    ? imageUrl
    : `/${imageUrl}`;

  return `${cleanApi}${cleanPath}`;
};

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /**
   * Load categories
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API}/api/blogs/categories`);

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setCategories(
            data.includes("All") ? data : ["All", ...data]
          );
        } else {
          setCategories(["All"]);
        }
      } catch (error) {
        console.error("Category fetch error:", error);
        setCategories(["All"]);
      }
    };

    fetchCategories();
  }, []);

  /**
   * Load blogs
   */
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);

      try {
        const url =
          activeCategory === "All"
            ? `${API}/api/blogs`
            : `${API}/api/blogs?category=${encodeURIComponent(
                activeCategory
              )}`;

        console.log("Fetching blogs from:", url);

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(
            `Failed to fetch blogs. Status: ${res.status}`
          );
        }

        const data = await res.json();

        console.log("Blog API response:", data);

        if (Array.isArray(data)) {
          setBlogs(data);
        } else if (Array.isArray(data?.blogs)) {
          setBlogs(data.blogs);
        } else {
          setBlogs([]);
        }
      } catch (error) {
        console.error("Blog fetch error:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [activeCategory]);

  /**
   * Navigate to blog detail
   */
  const handleBlogClick = (slug) => {
    if (!slug) return;

    navigate(`/blog/${slug}`);
  };

  /**
   * Handle broken images
   */
  const handleImageError = (event) => {
    console.error(
      "Blog image failed to load:",
      event.currentTarget.src
    );

    event.currentTarget.style.display = "none";

    const fallback = event.currentTarget.parentElement?.querySelector(
      ".image-fallback"
    );

    if (fallback) {
      fallback.classList.remove("hidden");
    }
  };

  return (
    <>
      {/* =========================================================
          SEO
      ========================================================= */}
      <Helmet>
        <title>
          Adway Creations Blog | Branding, Design & Digital Marketing
        </title>

        <meta
          name="description"
          content="Explore Adway Creations for insights and ideas on branding, design, packaging, web development, digital marketing and social media."
        />

        <meta
          name="robots"
          content="index, follow"
        />

        <link
          rel="canonical"
          href="https://adwaycreations.com/blog"
        />

        {/* Open Graph */}
        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:site_name"
          content="Adway Creations"
        />

        <meta
          property="og:title"
          content="Adway Creations Blog | Branding, Design & Digital Marketing"
        />

        <meta
          property="og:description"
          content="Insights and creative ideas about branding, design, packaging, web development and digital marketing from Adway Creations."
        />

        <meta
          property="og:url"
          content="https://adwaycreations.com/blog"
        />

        <meta
          property="og:image"
          content="https://adwaycreations.com/og-image.jpg"
        />

        {/* Twitter / X */}
        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content="Adway Creations Blog | Branding, Design & Digital Marketing"
        />

        <meta
          name="twitter:description"
          content="Insights and creative ideas about branding, design, packaging, web development and digital marketing from Adway Creations."
        />

        <meta
          name="twitter:image"
          content="https://adwaycreations.com/og-image.jpg"
        />
      </Helmet>

      {/* =========================================================
          HERO
      ========================================================= */}
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
            className="font-medium text-white leading-[1.0] text-left sm:text-center tracking-[-0.03em]"
            style={{
              fontVariationSettings: "'opsz' 144",
              fontSize: "clamp(22px, 8vw, 88px)",
            }}
          >
            Ideas that
            <br />
            move{" "}
            <em
              className="text-blue-500"
              style={{ fontStyle: "italic" }}
            >
              brands forward.
            </em>
          </h1>

          <p className="mt-6 text-white/50 text-left sm:text-center text-lg max-w-7xl leading-relaxed">
            Perspectives on branding, design, marketing, and the
            creative process from our team.
          </p>
        </div>
      </section>

      {/* =========================================================
          CATEGORY FILTER
      ========================================================= */}
      <section className="bg-black py-8 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
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

      {/* =========================================================
          BLOG GRID
      ========================================================= */}
      <section className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : blogs.length === 0 ? (
            /* Empty */
            <div className="text-center py-32">
              <Tag className="w-10 h-10 text-white/20 mx-auto mb-5" />

              <p className="text-white/30 text-lg">
                No blog posts yet. Check back soon.
              </p>
            </div>
          ) : (
            /* Blog cards */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, i) => {
                /**
                 * Support different API field names
                 */
                const image =
                  blog.coverImage ||
                  blog.cover_image ||
                  blog.image ||
                  blog.thumbnail ||
                  "";

                const imageUrl = resolveImageUrl(image);

                const title =
                  blog.title ||
                  "Untitled Blog";

                const excerpt =
                  blog.excerpt ||
                  blog.description ||
                  "";

                const author =
                  blog.author ||
                  "Adway Creations";

                const category =
                  blog.category ||
                  "";

                const readingTime =
                  blog.readingTime ||
                  blog.reading_time ||
                  1;

                const createdDate =
                  blog.created_at ||
                  blog.createdAt ||
                  blog.createdAt;

                return (
                  <article
                    key={blog.id || blog.slug || i}
                    onClick={() =>
                      handleBlogClick(blog.slug)
                    }
                    className="group relative overflow-hidden rounded-[28px]
                    border border-white/10
                    bg-gradient-to-b from-white/[0.08] to-white/[0.03]
                    backdrop-blur-xl
                    cursor-pointer
                    transition-all duration-700
                    hover:-translate-y-3
                    hover:border-blue-500/40"
                    style={{
                      animationDelay: `${i * 100}ms`,
                    }}
                  >
                    {/* =================================================
                        Glow
                    ================================================= */}
                    <div className="absolute -inset-px rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-blue-500/20 via-cyan-500/10 to-purple-500/20 blur-xl" />
                    </div>

                    {/* =================================================
                        IMAGE
                    ================================================= */}
                    <div className="relative h-64 overflow-hidden bg-white/[0.03]">
                      {imageUrl ? (
                        <>
                          <img
                            src={imageUrl}
                            alt={title}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            onError={handleImageError}
                          />

                          {/* Image fallback */}
                          <div className="image-fallback hidden absolute inset-0 items-center justify-center bg-white/[0.03]">
                            <Tag className="w-10 h-10 text-white/20" />
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Tag className="w-10 h-10 text-white/20" />
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

                      {/* =================================================
                          CATEGORY
                      ================================================= */}
                      {category && (
                        <div className="absolute top-5 left-5">
                          <span className="rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1 text-xs uppercase tracking-[0.2em] text-white">
                            {category}
                          </span>
                        </div>
                      )}

                      {/* =================================================
                          READ TIME
                      ================================================= */}
                      <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-3 py-1">
                        <Clock className="w-3 h-3 text-white/70" />

                        <span className="text-xs text-white/70">
                          {readingTime} min read
                        </span>
                      </div>

                      {/* =================================================
                          ARROW
                      ================================================= */}
                      <div
                        className="absolute right-5 bottom-5 h-12 w-12 rounded-full
                        bg-white text-black
                        flex items-center justify-center
                        scale-0 group-hover:scale-100
                        transition-all duration-500"
                      >
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                    </div>

                    {/* =================================================
                        CONTENT
                    ================================================= */}
                    <div className="relative p-7">
                      {/* Title */}
                      <h3
                        className="text-2xl font-semibold text-white mb-4
                        leading-tight transition-colors duration-300
                        group-hover:text-blue-400"
                      >
                        {title}
                      </h3>

                      {/* Excerpt */}
                      {excerpt && (
                        <p className="text-white/50 leading-relaxed line-clamp-3 mb-6">
                          {excerpt}
                        </p>
                      )}

                      {/* =================================================
                          FOOTER
                      ================================================= */}
                      <div className="flex items-center justify-between border-t border-white/10 pt-5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full
                            bg-gradient-to-br from-blue-500/30 to-cyan-500/30
                            border border-white/10
                            flex items-center justify-center"
                          >
                            <User className="w-4 h-4 text-white/80" />
                          </div>

                          <div>
                            <p className="text-sm text-white">
                              {author}
                            </p>

                            {createdDate && (
                              <p className="text-xs text-white/30">
                                {new Date(
                                  createdDate
                                ).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Read More */}
                        <div className="overflow-hidden">
                          <span
                            className="inline-flex items-center gap-2
                            text-sm text-white/60
                            group-hover:text-white
                            transition-colors"
                          >
                            Read More

                            <ArrowUpRight
                              className="w-4 h-4
                              transform
                              transition-transform
                              duration-300
                              group-hover:translate-x-1
                              group-hover:-translate-y-1"
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}