import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { API } from "../config/api";

const MAX_VISIBLE = 4;

export default function ClientsSection() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/clients`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setClients(Array.isArray(data) ? data : []))
      .catch(() => setClients([]))
      .finally(() => setLoading(false));
  }, []);

  const visibleClients = clients.slice(0, MAX_VISIBLE);
  const hasMore = clients.length > MAX_VISIBLE;

  if (!loading && clients.length === 0) return null;

  return (
    <section className="py-24 bg-black overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="text-white/50 font-semibold text-sm uppercase tracking-wider">
            Trusted By
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Brands that believe in bold
          </h2>
          <p className="mt-4 text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
            From startups to global enterprises, we've helped visionary teams
            build identities that endure.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-white/20 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Clients Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {visibleClients.map((client) => (
                <div
                  key={client.id}
                  className="group flex flex-col items-center justify-center px-6 py-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm hover:border-white/25 hover:bg-white/[0.07] transition-all duration-300"
                >
                  {client.logo ? (
                    <img
                      src={`${API}${client.logo}`}
                      alt={client.name}
                      className="h-14 w-auto object-contain grayscale brightness-600 opacity-100 group-hover:opacity-100 transition-all duration-300"
                    />
                  ) : (
                    <span className="text-white/60 group-hover:text-white text-lg font-bold tracking-wide transition-colors duration-300">
                      {client.name}
                    </span>
                  )}
                  <span className="mt-3 text-white/30 group-hover:text-white/50 text-xs font-medium tracking-wide transition-colors duration-300">
                    {client.name}
                  </span>
                </div>
              ))}
            </div>

            {/* View All CTA */}
            {hasMore && (
              <div className="mt-12 text-center">
                <Link
                  to="/clients"
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/[0.1] hover:border-white/30 text-white/80 hover:text-white text-sm font-semibold transition-all duration-300"
                >
                  View All Clients
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
