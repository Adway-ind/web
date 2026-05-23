import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Briefcase,
  Search,
  Filter,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  ChevronDown,
  Download, // Imported the Download icon for the button
} from "lucide-react";
import * as XLSX from "xlsx"; // Imported the installed Excel tool

const STATUS_COLORS = {
  new: "bg-blue-500/15 text-blue-400",
  reviewed: "bg-amber-500/15 text-amber-400",
  shortlisted: "bg-violet-500/15 text-violet-400",
  rejected: "bg-rose-500/15 text-rose-400",
  hired: "bg-emerald-500/15 text-emerald-400",
};

const STATUS_OPTIONS = ["new", "reviewed", "shortlisted", "rejected", "hired"];

export default function Applications() {
  const { authFetch } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const fetchApps = () => {
    authFetch("/api/admin/applications")
      .then(setApplications)
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchApps(); }, []);

  const updateStatus = async (id, status) => {
    try {
      const updated = await authFetch(`/api/admin/applications/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch { }
  };

  const deleteApp = async (id) => {
    if (!confirm("Delete this application?")) return;
    try {
      await authFetch(`/api/admin/applications/${id}`, { method: "DELETE" });
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch { }
  };

  const filtered = applications.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.position.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Excel Export Handler Function
  const handleExportExcel = () => {
    if (filtered.length === 0) return;

    // Flatten and structure data fields for the Excel sheet layout
    const excelData = filtered.map((app) => ({
      "Application ID": app.id,
      "Applicant Name": app.name,
      "Email Address": app.email,
      "Phone Number": app.phone || "N/A",
      "Position Applied": app.position,
      "Current Status": app.status.toUpperCase(),
      "Submission Date": new Date(app.createdAt).toLocaleDateString(),
      "Portfolio Link": app.portfolio || "N/A",
      "LinkedIn Profile": app.linkedin || "N/A",
      "Cover Note Summary": app.coverNote || "No cover note provided",
    }));

    // Generate workbook elements and download file
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications List");

    // Set auto-adjusting column sizes for enhanced layout scannability
    const maxProps = Object.keys(excelData[0]);
    worksheet["!cols"] = maxProps.map((key) => ({
      wch: Math.max(...excelData.map((row) => row[key]?.toString().length || 0), key.length) + 3,
    }));

    XLSX.writeFile(workbook, `Applications_Export_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-white/20 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Applications</h1>
          <p className="text-white/40 text-sm mt-1">
            {applications.length} total applications
          </p>
        </div>

        {/* Dynamic Export Button - Disables when filter array is empty */}
        <button
          onClick={handleExportExcel}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:hover:bg-violet-600 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-violet-600/10"
        >
          <Download className="w-4 h-4" />
          <span>Export Excel ({filtered.length})</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or position..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/20 outline-none focus:border-violet-500/30 transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-10 pr-8 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none appearance-none cursor-pointer"
          >
            <option value="all" className="bg-neutral-900">All Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="bg-neutral-900">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20 pointer-events-none" />
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/20">No applications found</p>
          </div>
        ) : (
          filtered.map((app) => (
            <div
              key={app.id}
              className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/10 transition-all"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-violet-400">
                        {app.name[0]}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {app.name}
                      </p>
                      <p className="text-xs text-white/40 truncate">{app.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider border-0 outline-none cursor-pointer ${STATUS_COLORS[app.status] || "bg-white/10 text-white/60"
                        }`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-neutral-900">
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                      className="p-2 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/[0.03] transition-all"
                    >
                      {expanded === app.id ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteApp(app.id)}
                      className="p-2 rounded-lg text-white/20 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs text-white/30">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    {app.position}
                  </span>
                  {app.phone && <span>{app.phone}</span>}
                  <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Expanded details */}
              {expanded === app.id && (
                <div className="px-5 pb-5 pt-0 border-t border-white/[0.04] mt-0">
                  <div className="pt-4 space-y-3">
                    {app.portfolio && (
                      <div className="flex items-center gap-2 text-sm">
                        <ExternalLink className="w-3.5 h-3.5 text-white/30" />
                        <a
                          href={app.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-400 hover:underline truncate"
                        >
                          {app.portfolio}
                        </a>
                      </div>
                    )}
                    {app.linkedin && (
                      <div className="flex items-center gap-2 text-sm">
                        <ExternalLink className="w-3.5 h-3.5 text-white/30" />
                        <a
                          href={app.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-400 hover:underline truncate"
                        >
                          {app.linkedin}
                        </a>
                      </div>
                    )}
                    {app.coverNote && (
                      <div className="mt-2">
                        <p className="text-[11px] text-white/30 uppercase tracking-wider mb-1">
                          Cover Note
                        </p>
                        <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">
                          {app.coverNote}
                        </p>
                      </div>
                    )}
                    {app.resume && (
                      <p className="text-sm text-white/40">
                        Resume: {app.resume}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}