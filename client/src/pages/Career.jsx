import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ArrowRight, ArrowUpRight } from "lucide-react";
import Video from "../assets/video/carrer-one.mp4";

/* ─── Animated counter ─── */
function useCountUp(end, duration = 2000) {
  const [count, setCount] = useState("0");
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started.current) {
      const id = requestAnimationFrame(() => setCount("0"));
      return;
    }
    const numEnd = parseFloat(end);
    const isDecimal = end.includes(".");
    const suffix = end.replace(/[\d.]/g, "");
    let cur = 0;
    const step = numEnd / (duration / 16);
    const timer = setInterval(() => {
      cur += step;
      if (cur >= numEnd) {
        cur = numEnd;
        clearInterval(timer);
      }
      setCount(isDecimal ? cur.toFixed(1) + suffix : Math.floor(cur) + suffix);
    }, 16);
    return () => clearInterval(timer);
  }, [started.current]);

  return [count, ref];
}

/* ─── Job data ─── */
const categories = [
  {
    title: "Business Development",
    count: 3,
    roles: [
      {
        title: "Senior Brand Designer",
        location: "Remote / New York",
        type: "Full-time",
      },
      {
        title: "Digital Product Designer",
        location: "Remote / New York",
        type: "Full-time",
      },
      { title: "Motion Designer", location: "Remote", type: "Full-time" },
    ],
  },
  {
    title: "HR and Finance",
    count: 2,
    roles: [
      {
        title: "Brand Strategist",
        location: "Remote / London",
        type: "Full-time",
      },
      { title: "Operations Manager", location: "New York", type: "Full-time" },
    ],
  },
  {
    title: "Data and Analytics",
    count: 2,
    roles: [
      { title: "Content Writer", location: "Remote", type: "Part-time" },
      { title: "Marketing Analyst", location: "Remote", type: "Full-time" },
    ],
  },
];

const values = [
  { number: "15", label: "Team Members" },
  { number: "5", label: "Countries" },
  { number: "97%", label: "Retention Rate" },
  { number: "4.8", label: "Rating" },
];

const perks = [
  {
    title: "Health & Wellness",
    desc: "Full medical, dental, vision + mental health support",
  },
  {
    title: "Flexible Hours",
    desc: "Async-first culture with core overlap hours",
  },
  {
    title: "Learning Budget",
    desc: "$2,000/year for courses, conferences & growth",
  },
  {
    title: "Remote-First",
    desc: "Work from anywhere. Home-office stipend included",
  },
  {
    title: "Creative Culture",
    desc: "Design sprints, hack days & brainstorm sessions",
  },
  {
    title: "Team Retreats",
    desc: "Annual offsites, free swag & latest design tools",
  },
];

/* ─── Accordion Row ─── */
function AccordionRow({ category, isOpen, onToggle }) {
  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-0 sm:px-2 transition-colors duration-300 group ${
          isOpen ? "bg-transparent" : "hover:bg-white/5"
        }`}
        style={{ height: "88px" }}
      >
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="text-xs font-medium text-white/30 tabular-nums w-6">
            {String(categories.indexOf(category) + 1).padStart(2, "0")}
          </span>
          <span className="text-lg sm:text-xl font-semibold text-white tracking-tight">
            {category.title}
          </span>
          <span className="text-sm text-white/30 font-medium">
            {category.count}
          </span>
        </div>
        <div
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "group-hover:translate-y-0.5"}`}
        >
          <ChevronDown className="w-5 h-5 text-white/30" strokeWidth={1.5} />
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-400 ease-in-out ${
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pb-8 pl-8 sm:pl-14">
          {category.roles.map((role) => (
            <Link
              key={role.title}
              to={`/apply?role=${encodeURIComponent(role.title)}`}
              className="group/role flex flex-col sm:flex-row sm:items-center justify-between py-5 border-b border-white/10 last:border-0 hover:pl-2 transition-all duration-200"
            >
              <div>
                <h4 className="text-base font-medium text-white group-hover/role:text-white/80 transition-colors">
                  {role.title}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-sm text-white/30">
                  <span>{role.location}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span>{role.type}</span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/20 group-hover/role:text-white/80 transition-colors mt-2 sm:mt-0 shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Stat ─── */
function Stat({ number, label }) {
  const [count, ref] = useCountUp(number);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl sm:text-5xl font-light text-white tracking-tight">
        {count}
      </div>
      <div className="text-xs text-white/40 mt-2 uppercase tracking-widest font-medium">
        {label}
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function Career() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black ">
        <div className="absolute inset-0">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
          </div>
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={Video} type="video/mp4" />
          </video>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 py-32 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-white/40 font-medium mb-8">
            Careers at Adway
          </p>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-bold text-white leading-[1.05] tracking-[-0.02em]">
            Shape the future
            <br />
            <span className="gradient-text font-bold">of branding</span>
          </h1>

          <p className="mt-8 text-base sm:text-lg text-white/40 max-w-xl mx-auto leading-relaxed font-light">
            Join a team of strategists, designers, and dreamers building brands
            that leave a mark.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#openings"
              className="group inline-flex items-center gap-2 text-sm font-medium text-white bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 px-7 py-3.5 rounded-full transition-all duration-300"
            >
              View Open Roles
              <ArrowDown className="w-4 h-4" />
            </a>
          </div>

          {/* <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 max-w-2xl mx-auto">
            {values.map((v) => (
              <Stat key={v.label} number={v.number} label={v.label} />
            ))}
          </div> */}
        </div>
      </section>

      {/* ═══ PERKS ═══ */}
      <section className="py-28 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.25em] text-white/40 font-medium mb-4 text-center">
            Why Adway
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white tracking-[-0.02em] text-center mb-20">
            Perks that power
            <br className="sm:hidden" /> your best work
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-14">
            {perks.map((perk, i) => (
              <div key={perk.title} className="group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-medium text-white/20 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1.5">
                  {perk.title}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed font-medium">
                  {perk.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CULTURE ═══ */}
      <section className="py-28 bg-black">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/40 font-medium mb-4">
                Our Culture
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-[-0.02em] leading-[1.1]">
                Where creativity
                <br />
                meets purpose
              </h2>
              <p className="mt-8 text-white/40 leading-relaxed font-medium">
                At Adway, you won't just make things look good — you'll make
                them mean something. Every brand has a story worth telling, and
                every team member has a voice worth hearing.
              </p>
              <p className="mt-4 text-white/40 leading-relaxed font-medium">
                No egos, no silos — just a shared passion for craft and impact.
                We collaborate across disciplines and celebrate bold ideas.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="rounded-2xl overflow-hidden aspect-[3/4]">
                  <img
                    src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&auto=format&fit=crop&q=60"
                    alt="Design"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1519408469771-2586093c3f14?w=500&auto=format&fit=crop&q=60"
                    alt="Workspace"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-3 pt-10">
                <div className="rounded-2xl overflow-hidden aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?w=500&auto=format&fit=crop&q=60"
                    alt="Creative"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[3/4]">
                  <img
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&q=80"
                    alt="Team"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CURRENT OPENINGS — Premium Minimal ═══ */}
      <section id="openings" className="py-28 bg-neutral-950">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-semibold text-white tracking-[-0.03em] leading-[1.05]">
              Current Openings
            </h2>
            <p className="mt-6 text-base sm:text-lg text-white/40 font-light max-w-lg mx-auto">
              Become part of a high-performing & collaborative team
            </p>
          </div>

          {/* Accordion */}
          <div className="border-t border-white/10">
            {categories.map((cat, i) => (
              <div key={cat.title} className="border-b border-white/10">
                <AccordionRow
                  category={cat}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center mt-16">
            <Link
              to="/apply"
              className="group inline-flex items-center gap-2 text-sm font-medium text-white border border-white/20 px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300"
            >
              See all openings
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="py-28 bg-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-[-0.02em]">
            Don't see your role?
          </h2>
          <p className="mt-6 text-white/40 font-light max-w-md mx-auto">
            We're always open to exceptional talent. Send us your portfolio and
            tell us how you'd make an impact.
          </p>
          <Link
            to="/apply"
            className="group inline-flex items-center gap-2 mt-10 text-sm font-medium text-white border border-white/20 px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300"
          >
            Send Open Application
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </Link>
        </div>
      </section>
    </>
  );
}

/* Small arrow-down icon for hero */
function ArrowDown({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 3v10M3 8l5 5 5-5" />
    </svg>
  );
}
