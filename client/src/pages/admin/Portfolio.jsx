import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { API } from "../../config/api";
import {
  Briefcase,
  Search,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Tag,
  User,
  Image as ImageIcon,
  X,
  PlusCircle,
  Download,
} from "lucide-react";
import * as XLSX from "xlsx";

const resolveImageUrl = (url) => {
  if (!url) return "";
  if (/^(?:https?:|blob:|data:)/.test(url)) return url;
  return `${API}${url}`;
};

export default function AdminPortfolio() {
  const { authFetch } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [coverFile, setCoverFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    image: "",
    tags: "",
    year: "",
    client: "",
    desc: "",
    challenge: "",
    result: "",
    images: "",
    featured: "",
  });

  const fetchProjects = () => {
    setLoading(true);
    authFetch("/api/admin/portfolio")
      .then((data) => {
        setProjects(data);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const exportToExcel = () => {
    if (projects.length === 0) {
      alert("No project data available to export.");
      return;
    }

    const sheetData = projects.map((project) => ({
      ID: project.id || "",
      Title: project.title || "",
      Slug: project.slug || "",
      Category: project.category || "",
      Client: project.client || "",
      Year: project.year || "",
      Featured: project.featured ? "Yes" : "No",
      Description: project.desc || "",
      Challenge: project.challenge || "",
      Result: project.result || "",
      Tags: Array.isArray(project.tags)
        ? project.tags.join(", ")
        : project.tags || "",
      "Cover Image URL": resolveImageUrl(project.image),
      "Gallery URLs": Array.isArray(project.images)
        ? project.images.map((url) => resolveImageUrl(url)).join(", ")
        : project.images || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Portfolio Projects");

    const maxColumnWidths = Object.keys(sheetData[0]).map((key) => {
      const maxLength = Math.max(
        key.length,
        ...sheetData.map((row) => (row[key] ? row[key].toString().length : 0))
      );
      return { wch: Math.min(maxLength + 3, 50) };
    });
    worksheet["!cols"] = maxColumnWidths;

    XLSX.writeFile(
      workbook,
      `portfolio_export_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const openAddModal = () => {
    setEditingProject(null);
    setCoverFile(null);
    setGalleryFiles([]);
    setFormData({
      title: "",
      slug: "",
      category: "Brand Strategy",
      image: "",
      tags: "",
      year: new Date().getFullYear().toString(),
      client: "",
      desc: "",
      challenge: "",
      result: "",
      images: "",
      featured: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setCoverFile(null);
    setGalleryFiles([]);
    setFormData({
      title: project.title || "",
      slug: project.slug || "",
      category: project.category || "Brand Strategy",
      image: project.image || "",
      tags: Array.isArray(project.tags)
        ? project.tags.join(", ")
        : project.tags || "",
      year: project.year || "",
      client: project.client || "",
      desc: project.desc || "",
      challenge: project.challenge || "",
      result: project.result || "",
      images: Array.isArray(project.images)
        ? project.images.join(", ")
        : project.images || "",
      featured: project.featured ? true : false,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await authFetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to delete project: " + err.message);
    }
  };

  /* ── Inline featured toggle with optimistic UI ── */
  const handleToggleFeatured = async (project) => {
    // Convert to 0/1 integer since database stores TINYINT
    const newFeatured = project.featured ? 0 : 1;

    // Optimistic UI update
    setProjects((prev) =>
      prev.map((p) =>
        p.id === project.id ? { ...p, featured: newFeatured } : p
      )
    );

    try {
      const form = new FormData();
      form.append("featured", newFeatured);

      const result = await authFetch(
        `/api/admin/portfolio/${project.id}`,
        {
          method: "PATCH",
          body: form,
        }
      );

      if (result && typeof result === "object") {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === project.id ? result : p
          )
        );
      }
    } catch (err) {
      // rollback
      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id
            ? { ...p, featured: project.featured }
            : p
        )
      );

      alert("Failed to update featured status: " + err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setFormData((prev) => ({
      ...prev,
      image: URL.createObjectURL(file),
    }));
  };

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const filesWithId = files.map((file) => ({
      file,
      localUrl: URL.createObjectURL(file),
    }));

    setGalleryFiles((prev) => [...prev, ...filesWithId]);

    setFormData((prev) => {
      const existing = prev.images
        ? prev.images.split(",").filter(Boolean)
        : [];
      const newPreviews = filesWithId.map((f) => f.localUrl);
      return {
        ...prev,
        images: [...existing, ...newPreviews].join(","),
      };
    });
  };

  const removeGalleryImage = (index) => {
    setFormData((prev) => {
      const imgs = prev.images.split(",").filter(Boolean);
      const targetUrl = imgs[index];

      setGalleryFiles((prevFiles) =>
        prevFiles.filter((item) => item.localUrl !== targetUrl)
      );

      imgs.splice(index, 1);
      return {
        ...prev,
        images: imgs.join(","),
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingProject ? "PATCH" : "POST";
    const url = editingProject
      ? `/api/admin/portfolio/${editingProject.id}`
      : "/api/admin/portfolio";

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("slug", formData.slug);
      form.append("category", formData.category);
      form.append("desc", formData.desc);
      form.append("year", formData.year);
      form.append("client", formData.client);
      form.append("challenge", formData.challenge);
      form.append("result", formData.result);
      form.append("tags", formData.tags);
      // Convert boolean to 0/1 for database
      form.append("featured", formData.featured ? 1 : 0);

      if (coverFile) {
        form.append("coverImage", coverFile);
      }

      const currentImages = formData.images.split(",").filter(Boolean);
      const existingDbUrls = currentImages.filter(
        (url) => !url.startsWith("blob:")
      );

      form.append("existingImages", JSON.stringify(existingDbUrls));

      galleryFiles.forEach((wrapper) => {
        form.append("galleryImages", wrapper.file);
      });

      const result = await authFetch(url, {
        method,
        body: form,
      });

      if (editingProject) {
        setProjects((prev) =>
          prev.map((p) => (p.id === editingProject.id ? result : p))
        );
      } else {
        setProjects((prev) => [result, ...prev]);
      }

      setIsModalOpen(false);
    } catch (err) {
      alert("Failed to save project: " + err.message);
    }
  };

  const filtered = projects.filter((p) => {
    const searchString = search.toLowerCase();
    return (
      (p.title?.toLowerCase() || "").includes(searchString) ||
      (p.category?.toLowerCase() || "").includes(searchString) ||
      (p.client?.toLowerCase() || "").includes(searchString)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio Items</h1>
          <p className="text-white/40 text-sm mt-1">
            {projects.length} total projects &mdash;{" "}
            <span className="text-violet-400">
              {projects.filter((p) => p.featured).length} featured
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToExcel}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all active:scale-[0.98]"
            title="Export full portfolio logs into an Excel worksheet"
          >
            <Download className="w-4 h-4 text-white/60" />
            Export Excel
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-violet-600/10"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, category, or client..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/20 outline-none focus:border-violet-500/30 transition-all"
        />
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-white/20 border-t-violet-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th className="px-4 py-3 text-left text-white/50 font-semibold">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-white/50 font-semibold">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-white/50 font-semibold">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-white/50 font-semibold">
                    Client
                  </th>
                  <th className="px-4 py-3 text-left text-white/50 font-semibold">
                    Year
                  </th>
                  <th className="px-4 py-3 text-left text-white/50 font-semibold">
                    Tags
                  </th>
                  {/* ── NEW: Featured column ── */}
                  <th className="px-4 py-3 text-center text-white/50 font-semibold">
                    Featured
                  </th>
                  <th className="px-4 py-3 text-right text-white/50 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-white/30">
                      No projects found
                    </td>
                  </tr>
                ) : (
                  filtered.map((project) => (
                    <tr
                      key={project.id}
                      className="border-b border-white/[0.05] hover:bg-white/[0.03] transition"
                    >
                      {/* Image */}
                      <td className="px-4 py-3">
                        {project.image ? (
                          <img
                            src={resolveImageUrl(project.image)}
                            alt={project.title}
                            className="w-16 h-12 rounded-lg object-cover border border-white/10"
                          />
                        ) : (
                          <div className="w-16 h-12 rounded-lg bg-white/5 flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-white/20" />
                          </div>
                        )}
                      </td>

                      {/* Title */}
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">
                          {project.title}
                        </div>
                        <div className="text-xs text-white/40 line-clamp-1">
                          {project.desc}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 text-white/70">
                        {project.category}
                      </td>

                      {/* Client */}
                      <td className="px-4 py-3 text-white/70">
                        {project.client}
                      </td>

                      {/* Year */}
                      <td className="px-4 py-3 text-white/70">
                        {project.year}
                      </td>

                      {/* Tags */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(project.tags)
                            ? project.tags
                            : typeof project.tags === "string"
                              ? project.tags
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean)
                              : []
                          )
                            .slice(0, 3)
                            .map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/60"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                      </td>

                      {/* ── Featured toggle ── */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleFeatured(project)}
                          title={
                            project.featured
                              ? "Remove from homepage"
                              : "Show on homepage"
                          }
                          className={`relative inline-flex w-11 h-6 rounded-full transition-all duration-300 focus:outline-none ${project.featured
                              ? "bg-violet-600"
                              : "bg-white/10 hover:bg-white/20"
                            }`}
                        >
                          <span
                            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${project.featured ? "translate-x-5" : ""
                              }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(project)}
                            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(project.id)}
                            className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up flex flex-col">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-neutral-900 z-10">
              <h2 className="text-lg font-bold text-white">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Lumina Cosmetics"
                    className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 outline-none focus:border-violet-500/30 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                    Slug (optional)
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="e.g. lumina-cosmetics"
                    className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 outline-none focus:border-violet-500/30 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                    Category *
                  </label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-violet-500/30 transition-all"
                  >
                    <option value="Brand Strategy">Brand Strategy</option>
                    <option value="Visual Identity">Visual Identity</option>
                    <option value="Digital Design">Digital Design</option>
                    <option value="Motion Graphics">Motion Graphics</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                    Year *
                  </label>
                  <input
                    type="text"
                    name="year"
                    required
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="e.g. 2026"
                    className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 outline-none focus:border-violet-500/30 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    name="client"
                    required
                    value={formData.client}
                    onChange={handleInputChange}
                    placeholder="e.g. Lumina Beauty Inc."
                    className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 outline-none focus:border-violet-500/30 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                    Main Image File
                  </label>
                  {!formData.image ? (
                    <div className="relative flex items-center justify-center w-full h-[38px] bg-white/[0.03] border border-white/10 border-dashed rounded-lg hover:bg-white/[0.05] transition-all group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <span className="text-xs text-white/40 group-hover:text-white/60 transition-all">
                        Choose file...
                      </span>
                    </div>
                  ) : (
                    <div className="relative flex items-center justify-between p-2 bg-white/[0.03] border border-white/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img
                          src={resolveImageUrl(formData.image)}
                          alt="Cover preview"
                          className="w-8 h-8 rounded object-cover border border-white/10"
                        />
                        <span className="text-xs text-white/60 truncate max-w-[180px]">
                          Main Cover Image Loaded
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCoverFile(null);
                          setFormData((prev) => ({ ...prev, image: "" }));
                        }}
                        className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Logo Design, Packaging, Typography"
                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 outline-none focus:border-violet-500/30 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                  Description *
                </label>
                <textarea
                  name="desc"
                  required
                  rows={3}
                  value={formData.desc}
                  onChange={handleInputChange}
                  placeholder="Short summary of the project..."
                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 outline-none focus:border-violet-500/30 transition-all resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                  The Challenge
                </label>
                <textarea
                  name="challenge"
                  rows={3}
                  value={formData.challenge}
                  onChange={handleInputChange}
                  placeholder="What was the problem?"
                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 outline-none focus:border-violet-500/30 transition-all resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                  The Result
                </label>
                <textarea
                  name="result"
                  rows={3}
                  value={formData.result}
                  onChange={handleInputChange}
                  placeholder="What was the outcome?"
                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 outline-none focus:border-violet-500/30 transition-all resize-none"
                />
              </div>

              {/* Gallery upload */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider block">
                  Project Gallery Images
                </label>

                <div className="relative flex flex-col items-center justify-center w-full py-4 px-3 bg-white/[0.01] border border-white/10 border-dashed rounded-xl hover:bg-white/[0.03] transition-all group text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImagesChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <span className="text-xs text-white/60 group-hover:text-violet-400 transition-all font-medium">
                    Click to upload gallery photos
                  </span>
                  <span className="text-[10px] text-white/30 mt-0.5">
                    Supports uploading multiple files at once
                  </span>
                </div>

                {formData.images &&
                  formData.images.split(",").filter(Boolean).length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                      {formData.images.split(",").map((imgUrl, idx) => {
                        if (!imgUrl) return null;
                        return (
                          <div
                            key={idx}
                            className="relative aspect-square rounded-md overflow-hidden border border-white/10 group bg-neutral-950"
                          >
                            <img
                              src={resolveImageUrl(imgUrl.trim())}
                              alt={`Preview asset ${idx}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(idx)}
                              className="absolute top-1 right-1 p-0.5 rounded bg-black/60 backdrop-blur-sm text-white/60 hover:text-red-400 hover:bg-black/90 transition-all"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>

              {/* Featured toggle */}
              <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/10 rounded-xl">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Featured Project
                  </h3>
                  <p className="text-xs text-white/40 mt-1">
                    Show this project in homepage featured section
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      featured: !prev.featured,
                    }))
                  }
                  className={`relative w-14 h-8 rounded-full transition-all duration-300 ${formData.featured ? "bg-violet-600" : "bg-white/10"
                    }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-all duration-300 ${formData.featured ? "translate-x-6" : ""
                      }`}
                  />
                </button>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-semibold transition-all active:scale-[0.98] shadow-lg shadow-violet-600/10"
                >
                  {editingProject ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}