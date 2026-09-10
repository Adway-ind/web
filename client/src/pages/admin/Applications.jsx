import { useCallback, useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { buildApiUrl } from "../../config/api";
import {
  Briefcase,
  Search,
  Filter,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  Download,
  CalendarDays,
  Clock,
  Globe2,
  Link,
} from "lucide-react";
import * as XLSX from "xlsx";

const STATUS_COLORS = {
  new: "bg-blue-500/15 text-blue-400",
  reviewed: "bg-amber-500/15 text-amber-400",
  shortlisted: "bg-violet-500/15 text-violet-400",
  rejected: "bg-rose-500/15 text-rose-400",
  hired: "bg-emerald-500/15 text-emerald-400",
};

const STATUS_OPTIONS = ["new", "reviewed", "shortlisted", "rejected", "hired"];

const getResumeUrl = (resume) => {
  if (!resume) return "";
  if (/^https?:\/\//i.test(resume)) return resume;
  return buildApiUrl(resume);
};

const getApplicationDate = (app) => app.createdAt || app.created_at || "";

const getExperience = (app) => app.experience || app.experience_years || "";

const getStartDate = (app) => app.startDate || app.start_date || app.earliest_start_date || "";

const formatDate = (value, fallback = "Not provided") => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString();
};

export default function Applications() {
  const { authFetch } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const fetchApps = useCallback(() => {
    authFetch("/api/admin/applications")
      .then(setApplications)
      .catch((err) => console.error("Failed to load applications:", err))
      .finally(() => setLoading(false));
  }, [authFetch]);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  const updateStatus = async (id, status) => {
    try {
      const updated = await authFetch(`/api/admin/applications/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch (err) {
      console.error("Failed to update application status:", err);
    }
  };

  const deleteApp = async (id) => {
    if (!confirm("Delete this application?")) return;
    try {
      await authFetch(`/api/admin/applications/${id}`, { method: "DELETE" });
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Failed to delete application:", err);
    }
  };

  const filtered = applications.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.position.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleExportExcel = () => {
    if (filtered.length === 0) return;

    const excelData = filtered.map((app) => ({
      "Application ID": app.id,
      "Applicant Name": app.name,
      "Email Address": app.email,
      "Phone Number": app.phone || "N/A",
      "Position Applied": app.position,
      "Years of Experience": getExperience(app) || "N/A",
      "Earliest Start Date": formatDate(getStartDate(app), "N/A"),
      "Current Status": app.status.toUpperCase(),
      "Submission Date": formatDate(getApplicationDate(app), "N/A"),
      "Portfolio Link": app.portfolio || "N/A",
      "LinkedIn Profile": app.linkedin || "N/A",
      "Cover Note Summary": app.coverNote || "No cover note provided",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications List");

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
          <h1 className="text-2xl font-bold text-white mt-[50px]">Applications</h1>
          <p className="text-white/40 text-sm mt-1">
            {applications.length} total applications
          </p>
        </div>

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
                    {app.resume && (
                      <a
                        href={getResumeUrl(app.resume)}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15 transition-all text-[11px] font-semibold uppercase tracking-wider"
                        title="Download uploaded resume"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Resume
                      </a>
                    )}
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider border-0 outline-none cursor-pointer ${
                        STATUS_COLORS[app.status] || "bg-white/10 text-white/60"
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
                  {getExperience(app) && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getExperience(app)}
                    </span>
                  )}
                  {getStartDate(app) && (
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {formatDate(getStartDate(app))}
                    </span>
                  )}
                  {app.phone && <span>{app.phone}</span>}
                  <span>{formatDate(getApplicationDate(app))}</span>
                </div>
              </div>

              {/* Expanded details */}
              {expanded === app.id && (
                <div className="px-5 pb-5 pt-0 border-t border-white/[0.04] mt-0">
                  <div className="pt-4 space-y-3">
                    {(getExperience(app) || getStartDate(app)) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        {getExperience(app) && (
                          <div className="flex items-center gap-2 text-white/60">
                            <Clock className="w-3.5 h-3.5 text-white/30" />
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">Years of experience</p>
                              <p>{getExperience(app)}</p>
                            </div>
                          </div>
                        )}
                        {getStartDate(app) && (
                          <div className="flex items-center gap-2 text-white/60">
                            <CalendarDays className="w-3.5 h-3.5 text-white/30" />
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">Earliest start date</p>
                              <p>{formatDate(getStartDate(app))}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {app.portfolio && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe2 className="w-3.5 h-3.5 text-white/30" />
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
                        <Link className="w-3.5 h-3.5 text-white/30" />
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
                      <div className="flex items-center gap-2 text-sm">
                        <Download className="w-3.5 h-3.5 text-white/30" />
                        <a
                          href={getResumeUrl(app.resume)}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="text-emerald-400 hover:underline truncate"
                        >
                          Download uploaded resume
                        </a>
                      </div>
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
