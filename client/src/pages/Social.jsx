import { ExternalLink } from "lucide-react";

import { FaInstagramSquare } from "react-icons/fa";

const INSTAGRAM_HANDLE = "adway.creations";
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

export default function Social() {

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-black overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-full text-sm font-medium mb-6">
            <FaInstagramSquare  className="w-4 h-4" />
            @{INSTAGRAM_HANDLE}
          </span>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-bold text-white leading-[1.05] tracking-[-0.02em]">
            Behind the
            <br />
            <span className="gradient-text">scenes</span>
          </h1>

          <p className="mt-6 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            Design & Printing — Branding | Advertising | Logo Design | Social
            Media Posters | Packaging. Follow our creative journey from
            Kattappana.
          </p>

          {/* Follow CTA */}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 mt-8 px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-500 text-white rounded-full font-semibold text-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-violet-500/20"
          >
            <FaInstagramSquare  className="w-5 h-5" />
            Follow on Instagram
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          {/* Stats */}
          
        </div>
      </section>

      {/* Elfsight Instagram Feed */}
      <section className="py-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="elfsight-app-a1405f9a-3266-4906-b34c-4ec94ed64d2f"
            data-elfsight-app-lazy
          ></div>
        </div>
      </section>

      {/* Embed / Connect CTA */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-violet-600/10 via-pink-500/5 to-indigo-600/10 border border-white/10">
            <FaInstagramSquare className="w-10 h-10 text-white/40 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Stay in the loop
            </h2>
            <p className="text-white/50 text-lg leading-relaxed max-w-xl mx-auto mb-8">
              We share process shots, brand launches, behind-the-scenes moments,
              and creative insights. Don't miss a thing.
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-500 text-white rounded-full font-semibold hover:opacity-90 transition-all duration-300"
            >
              <FaInstagramSquare  className="w-5 h-5" />
              Follow @{INSTAGRAM_HANDLE}
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
