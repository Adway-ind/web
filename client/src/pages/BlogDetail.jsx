import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, User, Calendar, Tag, Share2, Copy, Check } from "lucide-react";
import { API } from "../config/api";
import SEO from "../components/SEO";

const resolveImageUrl = (url) => {
  if (!url) return "";
  if (/^(?:https?:|blob:|data:)/.test(url)) return url;
  return `${API}${url}`;
};

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/blogs/${slug}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((d) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: data?.blog?.title, url });
      } catch {}
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!data?.blog) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-white text-2xl font-semibold mb-4">Blog post not found</h2>
          <button
            onClick={() => navigate("/blog")}
            className="text-white/50 hover:text-white transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </button>
        </div>
      </div>
    );
  }

  const { blog, prevBlog, nextBlog } = data;
  const tags = blog.tags ? blog.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  return (
    <>
      <SEO
        title={`${blog.title} | Adway Blog`}
        description={blog.excerpt || blog.content.substring(0, 160)}
        keywords={blog.tags || "blog, branding, design, marketing"}
        url={`/blog/${blog.slug}`}
      />

      {/* Hero / Cover */}
      <section className="relative bg-black pt-24 pb-12 overflow-hidden">
        {blog.coverImage && (
          <div className="absolute inset-0">
            <img
              src={resolveImageUrl(blog.coverImage)}
              alt={blog.title}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
          </div>
        )}

        <div className="relative max-w-3xl mx-auto px-6 lg:px-8">
          {/* Back link */}
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </button>

          {/* Category */}
          {blog.category && (
            <span className="inline-block px-3 py-1 rounded-full bg-white/[0.06] text-white/60 text-xs font-medium uppercase tracking-wider mb-6">
              {blog.category}
            </span>
          )}

          {/* Title */}
          <h1 className="text-white text-4xl sm:text-5xl font-bold leading-[1.1] tracking-[-0.02em] mb-6">
            {blog.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/40 mb-8">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {blog.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(blog.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {blog.readingTime || 1} min read
            </span>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors ml-auto"
              aria-label="Share this post"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
              {copied ? "Copied!" : "Share"}
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.08]" />
        </div>
      </section>

      {/* Article Content */}
      <section className="bg-black pb-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <article className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-white/70 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-blockquote:border-white/20 prose-blockquote:text-white/60 prose-code:text-blue-300 prose-code:bg-white/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-img:rounded-xl">
            <div
              dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, "<br/>") }}
            />
          </article>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-white/[0.06]">
              <Tag className="w-4 h-4 text-white/30 mr-1" />
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-white/[0.04] text-white/40 text-xs hover:bg-white/[0.08] hover:text-white/60 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Prev / Next Navigation */}
      {(prevBlog || nextBlog) && (
        <section className="bg-black border-t border-white/[0.06] py-12">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevBlog ? (
                <button
                  onClick={() => navigate(`/blog/${prevBlog.slug}`)}
                  className="group text-left p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all"
                >
                  <span className="flex items-center gap-1.5 text-xs text-white/30 mb-2">
                    <ArrowLeft className="w-3 h-3" /> Previous Post
                  </span>
                  <span className="text-white/70 group-hover:text-white text-sm font-medium transition-colors line-clamp-2">
                    {prevBlog.title}
                  </span>
                </button>
              ) : <div />}
              {nextBlog ? (
                <button
                  onClick={() => navigate(`/blog/${nextBlog.slug}`)}
                  className="group text-right p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all"
                >
                  <span className="flex items-center gap-1.5 text-xs text-white/30 mb-2 justify-end">
                    Next Post <ArrowRight className="w-3 h-3" />
                  </span>
                  <span className="text-white/70 group-hover:text-white text-sm font-medium transition-colors line-clamp-2">
                    {nextBlog.title}
                  </span>
                </button>
              ) : <div />}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
