import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Briefcase,
  MessageSquare,
  TrendingUp,
  Clock,
  MessageCircle,
  FileText,
} from "lucide-react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default function Dashboard() {
  const { authFetch } = useAuth();
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    Promise.all([authFetch("/api/admin/stats"), authFetch("/api/admin/activity")])
      .then(([s, a]) => {
        setStats(s);
        setActivity(a);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!chartRef.current || !stats) return;

    // Destroy any existing instance BEFORE the async call,
    // so the canvas is clean no matter what.
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    // Abort flag: if this effect re-runs before the fetch resolves,
    // the stale callback will see isCancelled=true and bail out
    // instead of calling new Chart() on an already-claimed canvas.
    let isCancelled = false;

    authFetch("/api/admin/stats/history")
      .then((history) => {
        if (isCancelled) return;          // effect re-ran — skip stale result
        if (!chartRef.current) return;    // component unmounted
        // Extra safety: destroy again in case something slipped through
        if (chartInstance.current) {
          chartInstance.current.destroy();
          chartInstance.current = null;
        }

        chartInstance.current = new Chart(chartRef.current, {
          type: "line",
          data: {
            labels: history.labels,
            datasets: [
              {
                label: "Applications",
                data: history.applications,
                borderColor: "#a78bfa",
                backgroundColor: "rgba(167,139,250,0.08)",
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: "#a78bfa",
                borderWidth: 2,
                fill: true,
              },
              {
                label: "Chat Enquiries",
                data: history.chat,
                borderColor: "#e879f9",
                backgroundColor: "rgba(232,121,249,0.06)",
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: "#e879f9",
                borderWidth: 2,
                fill: true,
              },
              {
                label: "Contact Enquiries",
                data: history.contact,
                borderColor: "#fbbf24",
                backgroundColor: "rgba(251,191,36,0.06)",
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: "#fbbf24",
                borderWidth: 2,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "rgba(0,0,0,0.85)",
                titleColor: "#fff",
                bodyColor: "rgba(255,255,255,0.6)",
                padding: 10,
                cornerRadius: 8,
                borderColor: "rgba(255,255,255,0.06)",
                borderWidth: 1,
              },
            },
            scales: {
              x: {
                grid: { color: "rgba(255,255,255,0.04)" },
                ticks: { color: "rgba(255,255,255,0.3)", font: { size: 11 } },
                border: { color: "rgba(255,255,255,0.06)" },
              },
              y: {
                beginAtZero: true,
                grid: { color: "rgba(255,255,255,0.04)" },
                ticks: {
                  color: "rgba(255,255,255,0.3)",
                  font: { size: 11 },
                  stepSize: 1,
                  precision: 0,
                },
                border: { color: "rgba(255,255,255,0.06)" },
              },
            },
          },
        });
      })
      .catch((err) => {
        if (!isCancelled) console.error("Failed to load chart history:", err);
      });

    // Cleanup: mark as cancelled AND destroy chart on unmount / re-run
    return () => {
      isCancelled = true;
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [stats]);

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
      value: stats?.applications ?? 0,
      new: stats?.newApplications || 0,
      icon: Briefcase,
      color: "violet",
    },
    {
      label: "Chat Enquiries",
      value: stats?.chatEnquiries ?? 0,
      new: stats?.newChatEnquiries || 0,
      icon: MessageCircle,
      color: "fuchsia",
    },
    {
      label: "Portfolio Items",
      value: stats?.portfolio ?? 0,
      new: null,
      icon: TrendingUp,
      color: "emerald",
    },
    {
      label: "Contact Enquiries",
      value: stats?.contactEnquiries ?? 0,
      new: null,
      icon: FileText,
      color: "amber",
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
    fuchsia: {
      bg: "bg-fuchsia-500/10",
      icon: "text-fuchsia-400",
      badge: "bg-fuchsia-500/20 text-fuchsia-300",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      icon: "text-emerald-400",
      badge: "bg-emerald-500/20 text-emerald-300",
    },
    amber: {
      bg: "bg-amber-500/10",
      icon: "text-amber-400",
      badge: "bg-amber-500/20 text-amber-300",
    },
  };

  const legendItems = [
    { label: "Applications", dot: "bg-violet-400" },
    { label: "Chat Enquiries", dot: "bg-fuchsia-400" },
    { label: "Contact Enquiries", dot: "bg-amber-400" },
  ];

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

      {/* Activity chart */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Activity — last 7 days
            </h2>
            <p className="text-white/30 text-xs mt-0.5">
              Daily submissions across all channels
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {legendItems.map(({ label, dot }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 text-[11px] text-white/30"
              >
                <span className={`w-2 h-2 rounded-sm ${dot}`} />
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="relative h-52">
          <canvas ref={chartRef} />
        </div>
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
                      ? "bg-violet-400"
                      : item.action === "logout"
                      ? "bg-white/20"
                      : "bg-green-400"
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