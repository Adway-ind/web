import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Settings as SettingsIcon, Save, Shield, Key, Globe } from "lucide-react";

export default function Settings() {
  const { authFetch, user } = useAuth();
  const [settings, setSettings] = useState({
    siteName: "",
    contactEmail: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    authFetch("/api/admin/settings")
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await authFetch("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-white/20 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/40 text-sm mt-1">
          Manage your site configuration
        </p>
      </div>

      {/* Site Settings */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Site Settings</h2>
            <p className="text-xs text-white/30">General website configuration</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none focus:border-violet-500/30 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
              Contact Email
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) =>
                setSettings({ ...settings, contactEmail: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white outline-none focus:border-violet-500/30 transition-all"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50"
        >
          {saving ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : saved ? (
            "Saved!"
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Security Info */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Security</h2>
            <p className="text-xs text-white/30">Authentication & session info</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-white/[0.04]">
            <div>
              <p className="text-sm text-white/70">Admin Email</p>
              <p className="text-xs text-white/30 mt-0.5">{user?.email}</p>
            </div>
            <span className="px-3 py-1 bg-violet-500/15 text-violet-400 rounded-lg text-[11px] font-semibold uppercase">
              {user?.role}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-white/[0.04]">
            <div>
              <p className="text-sm text-white/70">Auth Protocol</p>
              <p className="text-xs text-white/30 mt-0.5">
                JWT + bcrypt (12 salt rounds)
              </p>
            </div>
            <Key className="w-4 h-4 text-white/20" />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-white/[0.04]">
            <div>
              <p className="text-sm text-white/70">Session Timeout</p>
              <p className="text-xs text-white/30 mt-0.5">2 hours</p>
            </div>
            <span className="w-2 h-2 bg-emerald-400 rounded-full" />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm text-white/70">Rate Limiting</p>
              <p className="text-xs text-white/30 mt-0.5">
                10 login attempts / 15 min
              </p>
            </div>
            <span className="w-2 h-2 bg-emerald-400 rounded-full" />
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-rose-500/[0.03] border border-rose-500/10 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-rose-400 mb-2">Danger Zone</h2>
        <p className="text-xs text-white/30 mb-4">
          To change the admin password, update the <code className="text-white/50">ADMIN_PASS</code> environment variable on the server and restart.
        </p>
      </div>
    </div>
  );
}
