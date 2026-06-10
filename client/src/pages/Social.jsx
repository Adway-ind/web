import { ExternalLink } from "lucide-react";
import { FaInstagramSquare } from "react-icons/fa";
import SEO from "../components/SEO";

const INSTAGRAM_HANDLE = "adway.creations";
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

export default function Social() {
  return (
    <>
      <SEO
        title="Follow Adway on Social Media | Branding Agency"
        description="Follow Adway on social media for the latest branding inspiration, design trends, and creative insights. Connect with our community."
        keywords="adway social media, branding inspiration, design trends, creative community"
        url="/social"
      />
      {/* Hero */}
      <section className="relative bg-black pt-32 pb-20 overflow-hidden">
        {/* Background video — dimmed */}
        {/* <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        >
          <source src={Video} type="video/mp4" />
        </video> */}

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          {/* Eyebrow rule */}
          <div className="flex items-center gap-4 mb-10">
            <span className="text-[11px] tracking-[0.12em] uppercase text-white/50">
              Adway Studio — Service
            </span>
            <div className="flex-1 h-px bg-white/15" />
          </div>

          {/* Headline */}
          <h1
            className=" text-white leading-[1.0] tracking-[-0.03em] font-medium"
            style={{
              fontVariationSettings: "'opsz' 144",
              fontSize: "clamp(52px, 8vw, 88px)",
            }}
          >
            Everything
            <br />
            Your{" "}
            <em className="text-blue-500" style={{ fontStyle: "italic" }}>
              brand needs.
            </em>
          </h1>

          <p className="mt-5 text-[15px] text-white/50 leading-relaxed max-w-sm font-light">
            From strategy to execution, we provide a complete suite of branding
            services to help you stand out in a crowded marketplace.
          </p>

          {/* Follow CTA */}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 mt-8 px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-500 text-white rounded-full font-semibold text-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-violet-500/20"
          >
            <FaInstagramSquare className="w-5 h-5" />
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
              <FaInstagramSquare className="w-5 h-5" />
              Follow @{INSTAGRAM_HANDLE}
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
