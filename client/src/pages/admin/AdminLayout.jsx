import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LuFileStack } from "react-icons/lu";
import {
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronRight,
  FilePlus,
} from "lucide-react";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/applications", icon: Briefcase, label: "Applications" },
  { to: "/admin/career-jobs", icon: FilePlus, label: "Careers" },
  { to: "/admin/chat-enquiries", icon: MessageSquare, label: "Chat Enquiries" },
  { to: "/admin/contact-enquiries", icon: FilePlus, label: "Contact Enquiries" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
  { to: "/admin/portfolio", icon: LuFileStack, label: "Portfolio" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // mobile: drawer open/close
  const [mobileOpen, setMobileOpen] = useState(false);
  // desktop: sidebar collapsed/expanded
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex">

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          bg-black border-r border-white/[0.06] flex flex-col
          transition-all duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${desktopCollapsed ? "lg:w-[68px]" : "lg:w-64"}
          w-64
        `}
      >
        {/* Brand */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-white/[0.06] overflow-hidden">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          {!desktopCollapsed && (
            <span className="font-bold text-white text-sm whitespace-nowrap hidden lg:block">
              Adway Admin
            </span>
          )}
          <span className="font-bold text-white text-sm whitespace-nowrap lg:hidden">
            Adway Admin
          </span>
          {/* Close button — mobile only */}
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto lg:hidden text-white/40 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                  ? "bg-violet-600/15 text-violet-400"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                }`
              }
              title={desktopCollapsed ? item.label : undefined}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {(!desktopCollapsed) && (
                <span className="whitespace-nowrap hidden lg:block">{item.label}</span>
              )}
              <span className="whitespace-nowrap lg:hidden">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-white/[0.06] overflow-hidden">
          {!desktopCollapsed && (
            <div className="hidden lg:flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60">
                {user?.email?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{user?.email}</p>
                <p className="text-[10px] text-white/30 uppercase tracking-wider">{user?.role}</p>
              </div>
            </div>
          )}
          {/* Mobile user row */}
          <div className="lg:hidden flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60">
              {user?.email?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.email}</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wider">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className={`w-full mt-1 flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-all ${desktopCollapsed ? "lg:justify-center" : ""
              }`}
            title={desktopCollapsed ? "Sign Out" : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!desktopCollapsed && <span className="hidden lg:block">Sign Out</span>}
            <span className="lg:hidden">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 flex items-center gap-4 px-6 border-b border-white/[0.06] bg-black/50 backdrop-blur-sm">

          {/* Desktop toggle */}
          <button
            onClick={() => setDesktopCollapsed((prev) => !prev)}
            className="hidden lg:flex text-white/50 hover:text-white transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden text-white/50 hover:text-white transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-white/30">Admin</span>
            <ChevronRight className="w-3 h-3 text-white/15" />
            <span className="text-white/70 font-medium">
              <OutletBreadcrumb />
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function OutletBreadcrumb() {
  const path = window.location.pathname;
  if (path === "/admin") return "Dashboard";
  if (path.includes("applications")) return "Applications";
  if (path.includes("career-jobs")) return "Careers";
  if (path.includes("messages")) return "Messages";
  if (path.includes("chat-enquiries")) return "Chat Enquiries";
  if (path.includes("contact-enquiries")) return "Contact Enquiries";
  if (path.includes("portfolio")) return "Portfolio";
  if (path.includes("settings")) return "Settings";
  return "Admin";
}