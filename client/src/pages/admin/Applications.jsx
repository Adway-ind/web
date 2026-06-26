import { useEffect, useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function CareerApplications() {
  const { authFetch } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await authFetch("/api/admin/career-applications");
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;

    try {
      await authFetch(`/api/admin/career-applications/${id}`, {
        method: "DELETE",
      });

      await loadApplications();
    } catch (err) {
      setError(err.message || "Failed to delete application");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-white py-10">
        Loading applications...
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border border-white/10 bg-neutral-950 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white">
          Career Applications
        </h1>

        <p className="text-white/50 mt-2">
          Total Applications: {applications.length}
        </p>
      </div>

      {error && (
        <div className="mb-4 text-rose-400">
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="text-center text-white/50 py-10">
          No applications found.
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="rounded-3xl border border-white/10 bg-black/40 p-6"
            >
              <div className="grid gap-4 md:grid-cols-2">

                <div>
                  <p className="text-sm text-white/50">Name</p>
                  <p className="text-white">{app.name}</p>
                </div>

                <div>
                  <p className="text-sm text-white/50">Email</p>
                  <p className="text-white">{app.email}</p>
                </div>

                <div>
                  <p className="text-sm text-white/50">Phone</p>
                  <p className="text-white">{app.phone}</p>
                </div>

                <div>
                  <p className="text-sm text-white/50">Applied Position</p>
                  <p className="text-white">{app.position}</p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm text-white/50">Cover Letter</p>
                  <p className="text-white whitespace-pre-wrap">
                    {app.coverLetter || "No cover letter"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-white/50">Applied On</p>
                  <p className="text-white">
                    {new Date(app.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {app.resume && (
                  <a
                    href={`${import.meta.env.VITE_API_URL}${app.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2 text-white hover:bg-violet-500"
                  >
                    <Download className="w-4 h-4" />
                    Download Resume
                  </a>
                )}

                <button
                  onClick={() => handleDelete(app._id)}
                  className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-5 py-2 text-rose-200 hover:bg-rose-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}