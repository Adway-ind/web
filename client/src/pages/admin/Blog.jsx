import { useEffect, useState, useRef } from "react";
import { Plus, Trash2, Edit3, X, Eye, EyeOff, Image as ImageIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const initialForm = {
  title: "",
  excerpt: "",
  content: "",
  author: "Adway Team",
  category: "",
  tags: "",
  published: false,
};

export default function AdminBlog() {
  const { authFetch } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await authFetch("/api/admin/blogs");
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setCoverFile(null);
    setCoverPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleEdit = (blog) => {
    setForm({
      title: blog.title || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      author: blog.author || "Adway Team",
      category: blog.category || "",
      tags: blog.tags || "",
      published: !!blog.published,
    });
    setEditingId(blog.id);
    setCoverFile(null);
    setCoverPreview(blog.coverImage ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${blog.coverImage}` : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("excerpt", form.excerpt);
      formData.append("content", form.content);
      formData.append("author", form.author);
      formData.append("category", form.category);
      formData.append("tags", form.tags);
      formData.append("published", form.published ? "1" : "0");

      if (coverFile) {
        formData.append("coverImage", coverFile);
      }

      if (editingId) {
        await authFetch(`/api/admin/blogs/${editingId}`, {
          method: "PATCH",
          body: formData,
        });
      } else {
        await authFetch("/api/admin/blogs", {
          method: "POST",
          body: formData,
        });
      }

      resetForm();
      await loadBlogs();
    } catch (err) {
      setError(err.message || "Unable to save blog post.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    setError("");
    try {
      await authFetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
      await loadBlogs();
    } catch (err) {
      setError(err.message || "Unable to delete blog post.");
    }
  };

  const handleTogglePublish = async (blog) => {
    try {
      const formData = new FormData();
      formData.append("published", blog.published ? "0" : "1");
      await authFetch(`/api/admin/blogs/${blog.id}`, {
        method: "PATCH",
        body: formData,
      });
      await loadBlogs();
    } catch (err) {
      setError(err.message || "Unable to update status.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Blog Posts</h1>
          <p className="text-sm text-white/40 mt-1">Create and manage blog content</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
          {editingId ? "Edit Post" : "New Post"}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Title */}
          <div className="lg:col-span-2">
            <label className="text-xs text-white/40 mb-1 block">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={handleChange("title")}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm outline-none focus:border-violet-500/40 transition-colors"
              placeholder="Enter blog title"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs text-white/40 mb-1 block">Category</label>
            <input
              type="text"
              value={form.category}
              onChange={handleChange("category")}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm outline-none focus:border-violet-500/40 transition-colors"
              placeholder="e.g. Branding, Design"
            />
          </div>

          {/* Author */}
          <div>
            <label className="text-xs text-white/40 mb-1 block">Author</label>
            <input
              type="text"
              value={form.author}
              onChange={handleChange("author")}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm outline-none focus:border-violet-500/40 transition-colors"
              placeholder="Author name"
            />
          </div>

          {/* Tags */}
          <div className="lg:col-span-2">
            <label className="text-xs text-white/40 mb-1 block">Tags (comma-separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={handleChange("tags")}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm outline-none focus:border-violet-500/40 transition-colors"
              placeholder="branding, design, marketing"
            />
          </div>

          {/* Excerpt */}
          <div className="lg:col-span-2">
            <label className="text-xs text-white/40 mb-1 block">Excerpt (short summary)</label>
            <textarea
              value={form.excerpt}
              onChange={handleChange("excerpt")}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm outline-none focus:border-violet-500/40 transition-colors resize-none"
              placeholder="Brief description for listing pages"
            />
          </div>

          {/* Content */}
          <div className="lg:col-span-2">
            <label className="text-xs text-white/40 mb-1 block">Content * (HTML supported)</label>
            <textarea
              value={form.content}
              onChange={handleChange("content")}
              rows={10}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm outline-none focus:border-violet-500/40 transition-colors resize-y font-mono text-xs leading-relaxed"
              placeholder="Write your blog content here... HTML tags are supported."
            />
          </div>

          {/* Cover Image */}
          <div className="lg:col-span-2">
            <label className="text-xs text-white/40 mb-1 block">Cover Image</label>
            <div className="flex items-start gap-4">
              <label className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] border-dashed cursor-pointer hover:border-violet-500/30 transition-colors text-white/40 hover:text-white/60 text-sm">
                <ImageIcon className="w-4 h-4" />
                {coverFile ? coverFile.name : "Choose image (JPG, PNG, WEBP)"}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {coverPreview && (
                <div className="relative">
                  <img src={coverPreview} alt="Preview" className="w-24 h-16 object-cover rounded-lg border border-white/10" />
                  <button
                    type="button"
                    onClick={() => { setCoverFile(null); setCoverPreview(""); if (fileRef.current) fileRef.current.value = ""; }}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Published toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, published: !p.published }))}
              className={`w-10 h-5 rounded-full transition-colors relative ${form.published ? "bg-violet-600" : "bg-white/10"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.published ? "left-5" : "left-0.5"}`} />
            </button>
            <span className="text-sm text-white/50">{form.published ? "Published" : "Draft"}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {saving ? "Saving..." : editingId ? "Update Post" : "Create Post"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] text-white/50 text-sm hover:text-white transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Blog List */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">All Posts</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16 text-white/30 text-sm">No blog posts yet. Create your first post above.</div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {blogs.map((blog) => (
              <div key={blog.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                {/* Thumbnail */}
                <div className="w-16 h-10 rounded-lg overflow-hidden bg-white/[0.04] shrink-0">
                  {blog.coverImage ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}${blog.coverImage}`}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-white/15" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white truncate">{blog.title}</h3>
                  <div className="flex items-center gap-3 mt-0.5">
                    {blog.category && (
                      <span className="text-[10px] text-white/30 uppercase tracking-wider">{blog.category}</span>
                    )}
                    <span className="text-[10px] text-white/20">
                      {new Date(blog.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <button
                  onClick={() => handleTogglePublish(blog)}
                  className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    blog.published
                      ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                      : "bg-white/[0.04] text-white/30 hover:bg-white/[0.08]"
                  }`}
                  title={blog.published ? "Click to unpublish" : "Click to publish"}
                >
                  {blog.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {blog.published ? "Live" : "Draft"}
                </button>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id, blog.title)}
                    className="p-2 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
