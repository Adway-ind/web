import { useState, useEffect } from "react";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { API } from "../config/api";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/clients`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setClients(Array.isArray(data) ? data : []))
      .catch(() => setClients([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO
        title="Our Clients - Adway"
        description="Meet the brands we've partnered with. From startups to global enterprises, discover the companies that trust Adway for their branding and digital marketing needs."
        keywords="clients, brand partnerships, agency clients, trusted brands"
        url="/clients"
      />

      {/* Hero */}
      <section className="relative pt-36 pb-16 bg-black overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-purple-600/10 blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-white/50 font-semibold text-sm uppercase tracking-wider">
            Our Clients
          </span>
          <h1 className="mt-4 text-5xl sm:text-6xl font-bold text-white tracking-tight">
            Brands we've helped{" "}
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              grow
            </span>
          </h1>
          <p className="mt-5 text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Every logo here represents a partnership built on trust, strategy,
            and creative excellence. Here are the brands that chose Adway to
            shape their identity.
          </p>
        </div>
      </section>

      {/* Clients Grid */}
      <section className="pb-24 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-6 h-6 border-2 border-white/20 border-t-violet-500 rounded-full animate-spin" />
            </div>
          ) : clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-white/20" />
              </div>
              <div>
                <p className="text-white/40 font-medium">No clients yet</p>
                <p className="text-white/25 text-sm mt-1">
                  Clients will appear here once they are added from the admin panel.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="group flex flex-col items-center justify-center px-6 py-10 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm hover:border-white/25 hover:bg-white/[0.08] transition-all duration-300"
                >
                  {client.logo ? (
                    <img
                      src={`${API}${client.logo}`}
                      alt={client.name}
                      className="h-14 w-auto object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  ) : (
                    <span className="text-white/60 group-hover:text-white text-lg font-bold tracking-wide transition-colors duration-300">
                      {client.name}
                    </span>
                  )}
                  <span className="mt-4 text-white/40 group-hover:text-white/70 text-sm font-medium transition-colors duration-300">
                    {client.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Want your brand here?
          </h2>
          <p className="mt-4 text-white/60 text-base sm:text-lg leading-relaxed">
            Join the growing list of brands that trust Adway to bring their
            vision to life. Let's build something bold together.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2.5 px-8 py-4 bg-white text-black rounded-full font-semibold text-sm hover:bg-white/90 transition-all duration-300"
            >
              Start Your Project
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/[0.1] text-white/80 hover:text-white text-sm font-semibold transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
