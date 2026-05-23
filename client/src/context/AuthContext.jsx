import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("admin_token"));
  const [loading, setLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(`${API}/api/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem("admin_token");
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    localStorage.setItem("admin_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await fetch(`${API}/api/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // ignore
    }
    localStorage.removeItem("admin_token");
    setToken(null);
    setUser(null);
  };

  const authFetch = async (path, options = {}) => {
    const headers = {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    // Only add JSON header when body is NOT FormData
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API}${path}`, {
      ...options,
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        setToken(null);
        setUser(null);
      }

      throw new Error(data.error || "Request failed");
    }

    return data;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { API };
