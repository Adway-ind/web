import { useEffect, useState, useRef } from "react";
import { Plus, Trash2, Upload, Pencil, X, Check, Image as ImageIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { API } from "../../config/api";

export default function AdminClients() {
  const { authFetch } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPosition, setEditPosition] = useState("");
  const [editLogoFile, setEditLogoFile] = useState(null);
  const [editLogoPreview, setEditLogoPreview] = useState("");
  const fileRef = useRef(null);
  const editFileRef = useRef(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await authFetch("/api/admin/clients");
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load clients.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Add new client ── */
  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Client name is required.");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (position !== "") formData.append("position", position);
      if (logoFile) formData.append("logo", logoFile);

      await authFetch("/api/admin/clients", {
        method: "POST",
        body: formData,
      });

      setName("");
      setPosition("");
      setLogoFile(null);
      setLogoPreview("");
      if (fileRef.current) fileRef.current.value = "";
      await loadClients();
    } catch (err) {
      setError(err.message || "Failed to add client.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Edit client ── */
  const startEdit = (client) => {
    setEditingId(client.id);
    setEditName(client.name);
    setEditPosition(client.position?.toString() || "");
    setEditLogoFile(null);
    setEditLogoPreview(client.logo ? `${API}${client.logo}` : "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditPosition("");
    setEditLogoFile(null);
    setEditLogoPreview("");
    if (editFileRef.current) editFileRef.current.value = "";
  };

  const handleEditLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditLogoFile(file);
    setEditLogoPreview(URL.createObjectURL(file));
  };

  const saveEdit = async (id) => {
    setError("");
    if (!editName.trim()) {
      setError("Client name is required.");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", editName.trim());
      if (editPosition !== "") formData.append("position", editPosition);
      if (editLogoFile) formData.append("logo", editLogoFile);

      await authFetch(`/api/admin/clients/${id}`, {
        method: "PATCH",
        body: formData,
      });

      cancelEdit();
      await loadClients();
    } catch (err) {
      setError(err.message || "Failed to update client.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete client ── */
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete client "${name}"?`)) return;
    setError("");
    try {
      await authFetch(`/api/admin/clients/${id}`, { method: "DELETE" });
      await loadClients();
    } catch (err) {
      setError(err.message || "Failed to delete client.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Clients</h1>
        <p className="text-white/50 text-sm mt-1">
          Manage client logos and names displayed on the website.
        </p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Add new client form */}
      <form
        onSubmit={handleSubmit}
        className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-4"
      >
        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
          Add New Client
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Name */}
          <div>
            <label className="block text-xs text-white/40 mb-1.5 font-medium">Client Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Nexora"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-xs text-white/40 mb-1.5 font-medium">Display Order</label>
            <input
              type="number"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Auto"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>

          {/* Logo upload */}
          <div>
            <label className="block text-xs text-white/40 mb-1.5 font-medium">Logo Image</label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 border-dashed cursor-pointer hover:border-white/25 transition-colors text-white/40 hover:text-white/60 text-sm">
                <Upload className="w-4 h-4" />
                <span className="truncate">{logoFile ? logoFile.name : "Choose file"}</span>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Preview"
                  className="w-10 h-10 rounded-lg object-contain bg-white/5 border border-white/10 p-1"
                />
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          {saving ? "Adding..." : "Add Client"}
        </button>
      </form>

      {/* Clients list */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
            All Clients ({clients.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-5 h-5 border-2 border-white/20 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <ImageIcon className="w-8 h-8 text-white/15" />
            <p className="text-white/30 text-sm">No clients added yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/[0.05]">
            {clients.map((client) => (
              <li key={client.id} className="px-5 py-4 flex items-center gap-4">
                {editingId === client.id ? (
                  /* ── Edit mode ── */
                  <>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50"
                      />
                      <input
                        type="number"
                        value={editPosition}
                        onChange={(e) => setEditPosition(e.target.value)}
                        placeholder="Order"
                        className="px-3 py-2 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50"
                      />
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.06] border border-white/10 border-dashed cursor-pointer text-white/40 text-xs hover:text-white/60 transition-colors flex-1 truncate">
                          <Upload className="w-3.5 h-3.5 shrink-0" />
                          {editLogoFile ? editLogoFile.name : "New logo"}
                          <input
                            ref={editFileRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleEditLogoChange}
                            className="hidden"
                          />
                        </label>
                        {editLogoPreview && (
                          <img
                            src={editLogoPreview}
                            alt="Preview"
                            className="w-8 h-8 rounded object-contain bg-white/5 border border-white/10 p-0.5"
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => saveEdit(client.id)}
                        disabled={saving}
                        className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors disabled:opacity-50"
                        title="Save"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 rounded-lg bg-white/[0.06] text-white/50 hover:text-white/80 hover:bg-white/10 transition-colors"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  /* ── View mode ── */
                  <>
                    {/* Logo thumbnail */}
                    <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0 overflow-hidden p-1.5">
                      {client.logo ? (
                        <img
                          src={`${API}${client.logo}`}
                          alt={client.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-white/20 text-xs font-bold">
                          {client.name?.charAt(0)?.toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{client.name}</p>
                      <p className="text-white/30 text-xs">Order: {client.position ?? "—"}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => startEdit(client)}
                        className="p-2 rounded-lg bg-white/[0.04] text-white/40 hover:text-white/80 hover:bg-white/[0.1] transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id, client.name)}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/20 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
