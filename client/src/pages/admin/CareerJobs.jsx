import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const initialForm = {
  category: "",
  title: "",
  location: "Remote",
  type: "Full-time",
  description: "",
};

export default function CareerJobs() {
  const { authFetch } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await authFetch("/api/admin/careers");
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load career jobs.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.category.trim() || !form.title.trim() || !form.location.trim() || !form.type.trim() || !form.description.trim()) {
      setError("Please fill in every field before saving.");
      return;
    }

    setSaving(true);
    try {
      await authFetch("/api/admin/careers", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm(initialForm);
      await loadJobs();
    } catch (err) {
      setError(err.message || "Unable to save the job.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) {
      return;
    }
    setError("");

    try {
      await authFetch("/api/admin/careers", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      await loadJobs();
    } catch (err) {
      setError(err.message || "Unable to delete the job.");
    }
  };

  return (
    <div className="space-y-10">
      <div className="rounded-[32px] border border-white/10 bg-neutral-950 p-8 shadow-xl shadow-black/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-white/40 font-medium mb-2 mt-[50px]">
              Career management
            </p>
            <h1 className="text-3xl font-semibold text-white">Add a new career opening</h1>
            <p className="mt-3 text-white/50 max-w-2xl">
              Create or update job roles shown on the public Career page. Categories are auto-created when needed.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/40 px-5 py-4 text-sm text-white/60">
            {loading ? "Loading jobs…" : `${categories.length} categories in the system`}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 lg:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Category</label>
            <input
              type="text"
              value={form.category}
              onChange={handleChange("category")}
              placeholder="Business Development"
              className="w-full rounded-3xl border border-white/10 bg-black/60 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Role title</label>
            <input
              type="text"
              value={form.title}
              onChange={handleChange("title")}
              placeholder="Senior Brand Designer"
              className="w-full rounded-3xl border border-white/10 bg-black/60 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={handleChange("location")}
              placeholder="Remote / New York"
              className="w-full rounded-3xl border border-white/10 bg-black/60 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Position type</label>
            <select
              value={form.type}
              onChange={handleChange("type")}
              className="w-full rounded-3xl border border-white/10 bg-black/60 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-white/70 mb-2">Role description</label>
            <textarea
              value={form.description}
              onChange={handleChange("description")}
              rows={4}
              placeholder="Describe the role, responsibilities, and ideal candidate."
              className="w-full rounded-3xl border border-white/10 bg-black/60 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            />
          </div>

          <div className="sm:col-span-2 flex flex-col gap-4 sm:flex-row sm:justify-end">
            {error && <p className="text-sm text-rose-400">{error}</p>}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-violet-500/50"
            >
              <Plus className="w-4 h-4" />
              {saving ? "Saving…" : "Add job"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-[32px] border border-white/10 bg-neutral-950 p-8 shadow-xl shadow-black/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-white/40 font-medium mb-2">Existing openings</p>
            <h2 className="text-2xl font-semibold text-white">Public career listings</h2>
          </div>
          <p className="text-sm text-white/50">
            {categories.length} categories · {categories.reduce((sum, cat) => sum + (cat.roles?.length || 0), 0)} roles
          </p>
        </div>

        {loading ? (
          <div className="text-white/50">Loading available roles…</div>
        ) : categories.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-black/40 p-8 text-center text-white/50">
            No career roles have been added yet.
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category.title} className="rounded-3xl border border-white/10 bg-black/40 p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{category.title}</h3>
                    <p className="text-sm text-white/50">{category.count} role{category.count === 1 ? "" : "s"}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {category.roles.map((role) => (
                    <div
                      key={`${category.title}-${role.title}-${role.id}`}
                      className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium text-white">{role.title}</p>
                        <p className="mt-1 text-sm text-white/50">{role.location} · {role.type}</p>
                        {role.description ? (
                          <p className="mt-2 text-sm text-white/40">{role.description}</p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(role.id, role.title)}
                        className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/5 px-4 py-2 text-sm text-rose-200 transition hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
