import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  MessageSquare,
  Search,
  Trash2,
  Mail,
  MailOpen,
  ChevronDown,
} from "lucide-react";

export default function Messages() {
  const { authFetch } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const fetchMsgs = () => {
    authFetch("/api/admin/messages")
      .then(setMessages)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMsgs(); }, []);

  const toggleRead = async (id) => {
    try {
      const updated = await authFetch(`/api/admin/messages/${id}/read`, {
        method: "PATCH",
      });
      setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)));
    } catch {}
  };

  const deleteMsg = async (id) => {
    if (!confirm("Delete this message?")) return;
    try {
      await authFetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch {}
  };

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase())
  );

  const unreadCount = messages.filter((m) => !m.read).length;

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
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <p className="text-white/40 text-sm mt-1">
          {messages.length} messages{" "}
          {unreadCount > 0 && (
            <span className="text-blue-400">({unreadCount} unread)</span>
          )}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search messages..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/20 outline-none focus:border-violet-500/30 transition-all"
        />
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/20">No messages found</p>
          </div>
        ) : (
          filtered.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white/[0.02] border rounded-2xl overflow-hidden transition-all ${
                msg.read
                  ? "border-white/[0.04] opacity-70"
                  : "border-blue-500/20 hover:border-blue-500/30"
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        msg.read ? "bg-white/5" : "bg-blue-500/10"
                      }`}
                    >
                      <span
                        className={`text-sm font-bold ${
                          msg.read ? "text-white/30" : "text-blue-400"
                        }`}
                      >
                        {msg.name[0]}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-sm truncate ${
                          msg.read
                            ? "font-medium text-white/60"
                            : "font-semibold text-white"
                        }`}
                      >
                        {msg.name}
                      </p>
                      <p className="text-xs text-white/40 truncate">
                        {msg.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-white/20">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => toggleRead(msg.id)}
                      className="p-2 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/[0.03] transition-all"
                      title={msg.read ? "Mark unread" : "Mark read"}
                    >
                      {msg.read ? (
                        <MailOpen className="w-4 h-4" />
                      ) : (
                        <Mail className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                      className="p-2 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/[0.03] transition-all"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expanded === msg.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => deleteMsg(msg.id)}
                      className="p-2 rounded-lg text-white/20 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {msg.subject && (
                  <p className="mt-2 text-xs text-white/30 font-medium">
                    {msg.subject}
                  </p>
                )}
                <p className="mt-1 text-sm text-white/50 line-clamp-2">
                  {msg.message}
                </p>
              </div>

              {/* Expanded */}
              {expanded === msg.id && (
                <div className="px-5 pb-5 pt-0 border-t border-white/[0.04]">
                  <div className="pt-4">
                    <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>
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
