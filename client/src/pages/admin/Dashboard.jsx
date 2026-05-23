import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Briefcase,
  MessageSquare,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from "lucide-react";

export default function Dashboard() {
  const { authFetch } = useAuth();
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([authFetch("/api/admin/stats"), authFetch("/api/admin/activity")])
      .then(([s, a]) => {
        setStats(s);
        setActivity(a);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-white/20 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    {
      label: "Applications",
      value: stats?.applications || 0,
      new: stats?.newApplications || 0,
      icon: Briefcase,
      color: "violet",
    },
    {
      label: "Messages",
      value: stats?.messages || 0,
      new: stats?.newMessages || 0,
      icon: MessageSquare,
      color: "blue",
    },
    {
      label: "Portfolio Items",
      value: stats?.portfolio || 0,
      new: null,
      icon: TrendingUp,
      color: "emerald",
    },
  ];

  const colorMap = {
    violet: {
      bg: "bg-violet-500/10",
      icon: "text-violet-400",
      badge: "bg-violet-500/20 text-violet-300",
    },
    blue: {
      bg: "bg-blue-500/10",
      icon: "text-blue-400",
      badge: "bg-blue-500/20 text-blue-300",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      icon: "text-emerald-400",
      badge: "bg-emerald-500/20 text-emerald-300",
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">
          Overview of your Adway admin panel
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const c = colorMap[card.color];
          return (
            <div
              key={card.label}
              className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}
                >
                  <card.icon className={`w-5 h-5 ${c.icon}`} />
                </div>
                {card.new !== null && card.new > 0 && (
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${c.badge}`}
                  >
                    +{card.new} new
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-white">{card.value}</p>
              <p className="text-xs text-white/30 mt-1 uppercase tracking-wider">
                {card.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Activity log */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
          <Clock className="w-4 h-4 text-white/20" />
        </div>
        <div className="divide-y divide-white/[0.04]">
          {activity.length === 0 ? (
            <p className="px-6 py-8 text-sm text-white/20 text-center">
              No activity yet
            </p>
          ) : (
            activity.slice(0, 10).map((item, i) => (
              <div key={i} className="px-6 py-3 flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    item.action === "login"
                      ? "bg-emerald-400"
                      : item.action === "logout"
                      ? "bg-white/20"
                      : "bg-violet-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/60 truncate">
                    <span className="text-white/80 font-medium">
                      {item.user}
                    </span>{" "}
                    {item.action}
                  </p>
                </div>
                <span className="text-[11px] text-white/20 shrink-0">
                  {new Date(item.time).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
