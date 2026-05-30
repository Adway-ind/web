import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Search,
  Trash2,
  Mail,
  MailOpen,
  ChevronDown,
  Briefcase,
  Clock,
} from "lucide-react";

export default function ChatEnquiries() {
  const { authFetch } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const fetchEnquiries = () => {
    authFetch("/api/admin/chat-enquiries")
      .then(setEnquiries)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const toggleRead = async (id) => {
    try {
      const updated = await authFetch(`/api/admin/chat-enquiries/${id}/read`, {
        method: "PATCH",
      });
      setEnquiries((prev) => prev.map((e) => (e.id === id ? updated : e)));
    } catch {}
  };

  const deleteEnquiry = async (id) => {
    if (!confirm("Delete this enquiry?")) return;
    try {
      await authFetch(`/api/admin/chat-enquiries/${id}`, { method: "DELETE" });
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
    } catch {}
  };

  const filtered = enquiries.filter((enquiry) => {
    const query = search.toLowerCase();
    return (
      enquiry.contact.name.toLowerCase().includes(query) ||
      enquiry.contact.email.toLowerCase().includes(query) ||
      enquiry.contact.phone.toLowerCase().includes(query) ||
      enquiry.service.toLowerCase().includes(query) ||
      enquiry.projectType.toLowerCase().includes(query)
    );
  });

  const unreadCount = enquiries.filter((e) => !e.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-white/20 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Chat Enquiries</h1>
        <p className="text-white/40 text-sm mt-1">
          {enquiries.length} enquiries {unreadCount > 0 && <span className="text-blue-400">({unreadCount} unread)</span>}
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search enquiries..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/20 outline-none focus:border-violet-500/30 transition-all"
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/20">No chat enquiries found</p>
          </div>
        ) : (
          filtered.map((enquiry) => (
            <div
              key={enquiry.id}
              className={`bg-white/[0.02] border rounded-2xl overflow-hidden transition-all ${
                enquiry.read ? "border-white/[0.04] opacity-70" : "border-blue-500/20 hover:border-blue-500/30"
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        enquiry.read ? "bg-white/5" : "bg-blue-500/10"
                      }`}
                    >
                      <span
                        className={`text-sm font-bold ${
                          enquiry.read ? "text-white/30" : "text-blue-400"
                        }`}
                      >
                        {enquiry.contact.name[0]}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm truncate ${enquiry.read ? "font-medium text-white/60" : "font-semibold text-white"}`}>
                        {enquiry.contact.name}
                      </p>
                      <p className="text-xs text-white/40 truncate">{enquiry.contact.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-white/20">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => toggleRead(enquiry.id)}
                      className="p-2 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/[0.03] transition-all"
                      title={enquiry.read ? "Mark unread" : "Mark read"}
                    >
                      {enquiry.read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setExpanded(expanded === enquiry.id ? null : enquiry.id)}
                      className="p-2 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/[0.03] transition-all"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${expanded === enquiry.id ? "rotate-180" : ""}`} />
                    </button>
                    <button
                      onClick={() => deleteEnquiry(enquiry.id)}
                      className="p-2 rounded-lg text-white/20 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 mt-4 text-sm text-white/60">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">Service</p>
                      <p className="text-white">{enquiry.service}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">Project type</p>
                      <p className="text-white">{enquiry.projectType}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">Budget</p>
                      <p className="text-white">{enquiry.budget}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">Timeline</p>
                      <p className="text-white">{enquiry.timeline}</p>
                    </div>
                  </div>
                </div>
              </div>

              {expanded === enquiry.id && (
                <div className="px-5 pb-5 pt-0 border-t border-white/[0.04]">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="bg-white/[0.03] rounded-2xl p-4">
                      <p className="text-xs text-white/30 uppercase tracking-[0.2em] mb-3">Contact details</p>
                      <p className="text-sm text-white"><strong>Name:</strong> {enquiry.contact.name}</p>
                      <p className="text-sm text-white"><strong>Business:</strong> {enquiry.contact.business || "N/A"}</p>
                      <p className="text-sm text-white"><strong>Email:</strong> {enquiry.contact.email}</p>
                      <p className="text-sm text-white"><strong>Phone:</strong> {enquiry.contact.phone}</p>
                    </div>
                    <div className="bg-white/[0.03] rounded-2xl p-4">
                      <p className="text-xs text-white/30 uppercase tracking-[0.2em] mb-3">Project summary</p>
                      <p className="text-sm text-white/60 whitespace-pre-wrap">{enquiry.contact.requirements || "No additional requirements provided."}</p>
                    </div>
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
