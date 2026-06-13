import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ArrowRight, ArrowUpRight } from "lucide-react";
import Video from "../assets/video/carrer-one.mp4";
import { API } from "../config/api";
import SEO from "../components/SEO";

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
const defaultCategories = [
  {
    title: "Business Development",
    count: 3,
    roles: [
      {
        title: "Senior Brand Designer",
        location: "Remote / New York",
        type: "Full-time",
        description:
          "Lead visual storytelling and brand systems across digital product launches.",
      },
      {
        title: "Digital Product Designer",
        location: "Remote / New York",
        type: "Full-time",
        description:
          "Design seamless product experiences that align with brand strategy.",
      },
      {
        title: "Motion Designer",
        location: "Remote",
        type: "Full-time",
        description:
          "Create motion assets for campaigns, presentations, and web interactions.",
      },
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
        description:
          "Shape positioning and campaign strategy for our most ambitious clients.",
      },
      {
        title: "Operations Manager",
        location: "New York",
        type: "Full-time",
        description:
          "Oversee team operations, resourcing, and process improvements.",
      },
    ],
  },
  {
    title: "Data and Analytics",
    count: 2,
    roles: [
      {
        title: "Content Writer",
        location: "Remote",
        type: "Part-time",
        description:
          "Craft compelling copy for brands, campaigns, and client narratives.",
      },
      {
        title: "Marketing Analyst",
        location: "Remote",
        type: "Full-time",
        description:
          "Analyze marketing insights and recommend growth-focused strategies.",
      },
    ],
  },
];

const defaultValues = [
  { number: "15", label: "Team Members" },
  { number: "5", label: "Countries" },
  { number: "97%", label: "Retention Rate" },
  { number: "4.8", label: "Rating" },
];

const defaultPerks = [
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
function AccordionRow({ category, index, isOpen, onToggle }) {
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
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-lg sm:text-xl font-semibold text-white tracking-tight">
            {category.title}
          </span>
          <span className="text-sm text-white/30 font-medium">
            {category.roles?.length || 0}
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
                {role.description ? (
                  <p className="mt-2 text-sm text-white/40 max-w-2xl">
                    {role.description}
                  </p>
                ) : null}
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
  const [categories, setCategories] = useState(defaultCategories);
  const [values, setValues] = useState(defaultValues);
  const [perks, setPerks] = useState(defaultPerks);

  const [showAll, setShowAll] = useState(false);

  const displayedCategories = showAll ? categories : categories.slice(0, 5);

  useEffect(() => {
    fetch(`${API}/api/careers`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data.categories) setCategories(data.categories);
        if (data.stats) setValues(data.stats);
        if (data.perks) setPerks(data.perks);
      })
      .catch(() => {
        // Keep fallback static data if API is unavailable
      });
  }, []);

  return (
    <>
      <SEO
        title="Careers at Adway - Join Our Team | Branding Agency"
        description="Join Adway's talented team of creatives, strategists, and developers. Explore career opportunities in branding, design, and digital marketing."
        keywords="careers at adway, creative jobs, branding careers, design jobs, digital marketing careers"
        url="/career"
      />
      {/* ═══ HERO ═══ */}
      <section className="relative bg-black pt-32 pb-20 overflow-hidden">
        {/* Background video — dimmed */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        >
          <source src={Video} type="video/mp4" />
        </video>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          {/* Eyebrow rule */}
          <div className="flex items-center gap-4 mb-10">
            <span className="text-[11px] tracking-[0.12em] uppercase text-white/50">
              Adway Studio — Carrer
            </span>
            <div className="flex-1 h-px bg-white/15" />
          </div>

          {/* Headline */}
          <h1
            className="text-white text-center leading-[1.0] tracking-[-0.03em] font-medium"
            style={{
              fontVariationSettings: "'opsz ' 144",
              fontSize: "clamp(52px, 8vw, 88px)",
            }}
          >
            Shape the <br />
            future{" "}
            <em className="text-blue-500" style={{ fontStyle: "italic" }}>
               of branding
            </em>
          </h1>

          <p className="mt-5 text-[15px] text-center text-white/50 leading-relaxed max-w-7xl font-light">
            Join a team of strategists, designers, and dreamers building brands
            that leave a mark.
          </p>

          {/* Stats + scroll hint */}
        </div>
      </section>

      {/* ═══ PERKS ═══ */}
      <section className="py-28 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.25em] text-white/40 font-medium mb-4 text-center">
            Why Adway
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white tracking-[-0.02em] text-center mb-6">
            Perks that power
            <br className="sm:hidden" /> your best work
          </h2>
          <p className="text-base text-white/40 max-w-4xl mx-auto text-center mb-20 leading-relaxed">
            We believe that great work comes from happy, supported teams. That's
            why we've built a workplace culture that prioritizes well-being,
            professional growth, and work-life balance. Our comprehensive
            benefits package is designed to help you thrive both personally and
            professionally.
          </p>

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
      <section className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-black/40 font-medium mb-4">
                Our Culture
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black tracking-[-0.02em] leading-[1.1]">
                Where creativity
                <br />
                meets purpose
              </h2>
              <p className="mt-8 text-black/40 leading-relaxed font-medium ">
                At Adway, you won't just make things look good you'll make them
                mean something. Every brand has a story worth telling, and every
                team member has a voice worth hearing.
              </p>
              <p className="mt-4 text-black/40 leading-relaxed font-medium">
                No egos, no silos just a shared passion for craft and impact. We
                collaborate across disciplines and celebrate bold ideas.
              </p>
              <p className="mt-4 text-black/50 leading-relaxed font-medium text-base">
                Our collaborative workspace encourages open communication,
                creative experimentation, and continuous learning. We host
                regular workshops, design critiques, and knowledge-sharing
                sessions to keep our team at the forefront of industry trends
                and best practices. Whether you're a seasoned professional or
                just starting your career, you'll find ample opportunities to
                grow, innovate, and make a meaningful impact.
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
            <p className="mt-4 text-base text-white/35 max-w-5xl mx-auto leading-relaxed">
              We're always looking for talented individuals who share our
              passion for creative excellence and brand storytelling. If you
              don't see a role that matches your skills, we still encourage you
              to reach out with an open application. We believe in nurturing
              talent and creating opportunities for the right people.
            </p>
          </div>

          {/* Accordion */}
          <div className="border-t border-white/10">
            {displayedCategories.map((cat, i) => (
              <div key={cat.title} className="border-b border-white/10">
                <AccordionRow
                  index={i}
                  category={cat}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              </div>
            ))}
          </div>

          {/* CTA Button */}
          {categories.length > 5 && !showAll && (
            <div className="flex justify-center mt-16">
              <button
                onClick={() => setShowAll(true)}
                className="group inline-flex items-center gap-2 text-sm font-medium text-white border border-white/20 px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300"
              >
                See all openings
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
              </button>
            </div>
          )}
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
