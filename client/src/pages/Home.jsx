import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Palette,
  Target,
  Zap,
  Layers,
  TrendingUp,
  Sparkles,
  Star,
  Quote,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";

import Client from "../components/ClientsSection";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import VideoSlide from "../assets/video/slide/video-slide-3.mp4";
import { API } from "../config/api";
import { useAuth } from "../context/AuthContext";
import Antigravity from "../components/Antigravity";
import SEO from "../components/SEO";

import "swiper/css";

/* ───── Resolve image URL helper ───── */
const resolveImageUrl = (url) => {
  if (!url) return "";
  if (/^(?:https?:|blob:|data:)/.test(url)) return url;
  return `${API}${url}`;
};

/* ───── Hero text slides (video is the shared background) ───── */
const heroSlides = [
  {
    title: "Digital",
    highlight: "Marketing",
    paragraph:
      "We are a leading Digital marketing agency with award-winning creative strategists and technologists.",
  },
  {
    title: "Strategic",
    highlight: "Consulting",
    paragraph:
      "We specialize in establishing your brand and marketing strategy to attract consumers.",
  },
  {
    title: "Creative",
    highlight: "Branding",
    paragraph:
      "We are experts in logo design, packaging design, and brand communications design.",
  },
  {
    title: "Technology",
    highlight: "Solutions",
    paragraph:
      "We have deep expertise and experts in responsive web design and CMS web development",
  },
];

const showcaseData = [
  {
    id: 1,
    type: "image",
    image:
      "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?q=80&w=1200&auto=format&fit=crop",
    className: "col-span-1 row-span-2",
  },
  {
    id: 2,
    type: "content",
    title: "International Packaging Designs and Quality",
    desc: "We create impactful branding and packaging experiences that blend creativity, strategy, and functionality for modern businesses.",
    className: "col-span-1 row-span-1",
  },
  {
    id: 3,
    type: "gallery",
    images: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop",
    ],
    className: "col-span-1 row-span-1",
  },
  {
    id: 4,
    type: "content",
    title: "150+ Brand Identities Created",
    desc: "We build memorable visual identities that connect brands with audiences through timeless and strategic design systems.",
    className: "col-span-1 row-span-1",
  },
  {
    id: 5,
    type: "image",
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=1200&auto=format&fit=crop",
    className: "col-span-1 row-span-1",
  },
  {
    id: 6,
    type: "content",
    title: "Brand Communications & Experience",
    desc: "From digital campaigns to storytelling, we help brands create meaningful customer experiences across every touchpoint.",
    className: "col-span-1 row-span-1",
  },
  {
    id: 7,
    type: "image",
    image: "https://images.pexels.com/photos/7675029/pexels-photo-7675029.jpeg",
    className: "col-span-1 row-span-1",
  },
  {
    id: 6,
    type: "content",
    title: "Modern Web Experiences",
    desc: "We design and develop fast, responsive, and visually engaging websites that enhance user experience and help brands grow online.",
    className: "col-span-1 row-span-1",
  },
];

const services = [
  {
    icon: Target,
    title: "Creative Branding",
    desc: "We uncover insights that define your brand's position and create a roadmap for meaningful growth.",
  },
  {
    icon: Palette,
    title: "Digital Marketing",
    desc: "From logos to color systems, we design visual identities that capture your brand's essence.",
  },
  {
    icon: Layers,
    title: "Web Development",
    desc: "Beautiful, intuitive digital experiences that connect with your audience on every screen.",
  },
  {
    icon: Zap,
    title: "eCommerce Development",
    desc: "Dynamic animations and motion design that bring your brand story to life.",
  },
  {
    icon: TrendingUp,
    title: "Marketing Strategy",
    desc: "Strategic brand evolution that scales with your business and resonates in new markets.",
  },
  {
    icon: Sparkles,
    title: "Consulting",
    desc: "Comprehensive brand books that ensure consistency across every touchpoint.",
  },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "CEO, Lumina Cosmetics",
    text: "Adway transformed our brand from the ground up. Their strategic approach and stunning design elevated us to a premium position in the market.",
    rating: 5,
  },
  {
    name: "James Rodriguez",
    role: "Founder, TechVault",
    text: "Working with Adway was a game-changer. They didn't just design a logo — they crafted an entire brand experience that our customers love.",
    rating: 5,
  },
  {
    name: "Emily Chen",
    role: "CMO, EcoGreen",
    text: "The team at Adway truly understands the intersection of strategy and design. Our rebrand exceeded all expectations and business metrics.",
    rating: 5,
  },
  {
    name: "Emily Chen",
    role: "CMO, EcoGreen",
    text: "The team at Adway truly understands the intersection of strategy and design. Our rebrand exceeded all expectations and business metrics.",
    rating: 5,
  },
  {
    name: "Emily Chen",
    role: "CMO, EcoGreen",
    text: "The team at Adway truly understands the intersection of strategy and design. Our rebrand exceeded all expectations and business metrics.",
    rating: 5,
  },
];

/* ───── Hero Slider Component ───── */
function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const total = heroSlides.length;

  const goTo = useCallback(
    (index) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent((index + total) % total);
      setTimeout(() => setIsTransitioning(false), 900);
    },
    [isTransitioning, total],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  /* Auto-play */
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Antigravity 3D Effect Background */}
      <div className="absolute inset-0 w-full h-full z-[1] pointer-events-none">
        <Antigravity
          color="#A855F7"
          colorTwo="#6366F1"
          ringCount={6}
          speed={1}
          attenuation={10}
          lineThickness={2}
          baseRadius={0.35}
          radiusStep={0.1}
          scaleRate={0.1}
          opacity={1}
          blur={0}
          noiseAmount={0.1}
          rotation={0}
          ringGap={1.5}
          fadeIn={0.7}
          fadeOut={0.5}
          followMouse={false}
          mouseInfluence={0.2}
          hoverScale={1.2}
          parallax={0.05}
          clickBurst={false}
        />
      </div>
      {/* Single shared video backdrop */}
      {/* <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-[2]">
        <video
          src={VideoSlide}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover scale-105 opacity-40"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 opacity-90" />
      </div> */}
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] z-[3] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Content Layer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center flex flex-col items-center justify-center min-h-screen w-full pointer-events-none">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-[1200ms] ease-in-out px-2 sm:px-4 w-full max-w-7xl mx-auto"
            style={{
              opacity: i === current ? 1 : 0,
              pointerEvents: i === current ? "auto" : "none",
              transform:
                i === current
                  ? "scale(1) translateY(0px)"
                  : "scale(0.98) translateY(15px)",
            }}
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.1] sm:leading-[1.05] tracking-tight animate-fade-in-up animation-delay-200 mx-auto text-center pointer-events-auto">
              {slide.title}
              <span className="gradient-text ml-2 sm:ml-5">
                {slide.highlight}
              </span>
            </h1>

            <p className="mt-4 sm:mt-6 md:mt-8 text-sm sm:text-base md:text-lg lg:text-xl text-white/80 max-w-xl sm:max-w-2xl leading-relaxed animate-fade-in-up animation-delay-400 mx-auto text-center px-2 pointer-events-auto">
              {slide.paragraph}
            </p>

            <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-in-up animation-delay-600 w-full px-2 pointer-events-auto">
              <Link
                to="/contact"
                className="group w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-black rounded-md font-semibold text-[10px] sm:text-lg hover:bg-white/90 transition-all duration-300 shadow-lg shadow-white/10 hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Start Your Project
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/portfolio"
                className="group relative overflow-hidden w-full sm:w-auto rounded-md p-[1px]"
              >
                {/* White Animated Border */}
                <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,white_40%,transparent_60%)]" />

                {/* Button */}
                <span className="relative z-10 flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-black/80 backdrop-blur-xl text-white border border-white/10 rounded-md font-semibold text-[10px] sm:text-lg hover:bg-white/10 transition-all duration-300">
                  View Our Work
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
      {/* Scroll indicator */}
      {/* <div className="absolute bottom-8 z-10 left-1/2 -translate-x-1/2 pointer-events-none">
        <p className="text-white/40 text-sm tracking-widest animate-bounce">
          SCROLL
        </p>
      </div> */}
    </section>
  );
}

/* ───── Featured Portfolio Section ───── */
function FeaturedPortfolio() {
  const { authFetch } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Hit the public endpoint that we just fixed on the backend
    authFetch("/api/projects/featured")
      .then((data) => {
        // The backend query handles the filtering directly via SQL,
        // so if data exists, it's safe to load straight into state!
        const featured = Array.isArray(data) ? data : [];
        setProjects(featured);
      })
      .catch((err) => {
        console.error("Error fetching featured projects:", err);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Show 4 by default; "Show All Featured" reveals the rest
  const visibleProjects = showAll ? projects : projects.slice(0, 6);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-white/50 font-semibold text-sm uppercase tracking-wider">
              Our Work
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-black tracking-tight">
              Featured projects
            </h2>
            <p className=" text-center sm:text-left mt-4 text-lg text-black/60 max-w-xl">
              A selection of brands we've helped build, transform, and grow.
            </p>
          </div>
          <Link
            to="/portfolio"
            className="group inline-flex items-center justify-center gap-2 text-black font-semibold hover:gap-3 transition-all shrink-0"
          >
            View All Projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="w-6 h-6 border-2 border-white/20 border-t-violet-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state — no featured projects yet */}
        {!loading && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-white/20" />
            </div>
            <div>
              <p className="text-white/40 font-medium">
                No featured projects yet
              </p>
              <p className="text-white/25 text-sm mt-1">
                Mark projects as featured in the admin panel to display them
                here.
              </p>
            </div>
            <Link
              to="/portfolio"
              className="mt-2 inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              Browse all projects <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && visibleProjects.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {visibleProjects.map((item) => (
                <Link
                  to={`/portfolio/${item.slug || item.id}`}
                  key={item.id}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
                >
                  {item.image ? (
                    <img
                      src={resolveImageUrl(item.image)}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-white/5 flex items-center justify-center">
                      <ImageIcon className="w-10 h-10 text-white/10" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />

                  {/* Featured badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 rounded-full bg-violet-500/30 border border-violet-400/40 backdrop-blur-sm text-[11px] font-semibold text-violet-300 tracking-wide">
                      Featured
                    </span>
                  </div>

                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <span className="text-white/60 text-sm font-medium">
                      {item.category}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                      {item.title}
                    </h3>
                    {item.client && (
                      <p className="text-white/50 text-sm mt-1">
                        {item.client}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-2 text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      View Project <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Show more / show less toggle (only if there are more than 4 featured) */}
            {projects.length > 6 && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setShowAll((v) => !v)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-white/70 hover:text-white text-sm font-semibold transition-all"
                >
                  {showAll ? (
                    <>Show Less</>
                  ) : (
                    <>
                      Show All {projects.length} Featured Projects{" "}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

/* ───── Home Page ───── */
export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Adway",
    "url": "https://adway.agency",
    "logo": "https://adway.agency/favicon.svg",
    "description": "Premium Branding & Digital Marketing Agency",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Creative Ave",
      "addressLocality": "Design District",
      "addressRegion": "NY",
      "postalCode": "10001",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "Customer Service"
    },
    "sameAs": [
      "https://facebook.com/adway",
      "https://instagram.com/adway",
      "https://linkedin.com/company/adway",
      "https://twitter.com/adway"
    ]
  };

  return (
    <>
      <SEO 
        title="Adway - Premium Branding & Digital Marketing Agency"
        description="Transform your brand with Adway's expert branding, digital marketing, web development, and strategic consulting services. We create impactful brand experiences."
        keywords="branding agency, digital marketing, web development, creative branding, marketing strategy, brand identity, logo design"
        url="/"
        structuredData={structuredData}
      />
      {/* Hero Slider */}
      <HeroSlider />

      {/* Services Overview */}
      <section className="relative py-24 bg-black overflow-hidden">
        <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none mix-blend-screen animate-pulse duration-[6000ms]" />
        <div className="absolute bottom-1/4 right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/15 blur-[140px] pointer-events-none mix-blend-screen animate-pulse duration-[8000ms]" />
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full bg-fuchsia-500/10 blur-[100px] pointer-events-none mix-blend-screen" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-white/50 font-semibold text-sm uppercase tracking-wider">
              What We Do
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-white tracking-tight">
              Services built for impact
            </h2>
            <p className="mt-4 text-lg text-white/60">
              We offer a complete suite of branding services designed to
              transform your business into a memorable brand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="group relative p-8 rounded-2xl overflow-hidden border border-white/20 bg-gradient-to-br from-white/[0.07] to-white/[0.01] backdrop-blur-xl shadow-2xl shadow-black/40 hover:border-white/30 hover:from-white/[0.12] hover:to-white/[0.03] hover:-translate-y-1 transition-all duration-500"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (
                    ((e.clientX - rect.left) / rect.width) *
                    100
                  ).toFixed(1);
                  const y = (
                    ((e.clientY - rect.top) / rect.height) *
                    100
                  ).toFixed(1);
                  e.currentTarget.style.setProperty("--gx", `${x}%`);
                  e.currentTarget.style.setProperty("--gy", `${y}%`);
                }}
              >
                {/* Noise texture */}
                <div
                  className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none select-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />
                {/* Top sheen */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
                {/* Glare layer */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 40%, transparent 70%)",
                  }}
                />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                    <service.icon className="w-7 h-7 text-white group-hover:text-black transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-wide">
                    {service.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed font-light">
                    {service.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="group inline-flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all"
            >
              Explore All Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Portfolio (API-driven) ── */}
      <FeaturedPortfolio />

      {/* Testimonials */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-white/50 font-semibold text-sm uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-white tracking-tight">
              What our clients say
            </h2>
          </div>

          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.name}>
                <div className="relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 hover:shadow-lg transition-all duration-300 h-full">
                  <Quote className="w-10 h-10 text-white/10 mb-4" />
                  <p className="text-white/70 leading-relaxed mb-6">{t.text}</p>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{t.name}</div>
                    <div className="text-sm text-white/50">{t.role}</div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <Client />

      <section className="bg-white py-20">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-14">
            <span className="text-sm tracking-[0.3em] uppercase text-neutral-500 font-medium">
              Our Expertise
            </span>

            <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900">
              Creative Branding Experience
            </h2>

            <p className="mt-5 max-w-2xl mx-auto text-neutral-600 leading-relaxed">
              We craft premium branding, packaging, and digital experiences
              designed to elevate businesses in modern markets.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[320px] gap-[1px] bg-neutral-300 overflow-hidden rounded-3xl">
            {showcaseData.map((item) => (
              <div
                key={item.id}
                className={`bg-white ${item.className} overflow-hidden group`}
              >
                {/* Single Image */}
                {item.type === "image" && (
                  <div className="h-full w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt=""
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                )}

                {/* Content Block */}
                {item.type === "content" && (
                  <div className="h-full flex flex-col items-center justify-center text-center px-8 md:px-12">
                    <h3 className="text-2xl md:text-3xl font-semibold text-neutral-900 leading-tight">
                      {item.title}
                    </h3>

                    <p className="mt-6 text-neutral-600 leading-8 max-w-md">
                      {item.desc}
                    </p>

                    <div className="w-24 h-[2px] bg-violet-500 mt-10" />
                  </div>
                )}

                {/* Gallery Grid */}
                {item.type === "gallery" && (
                  <div className="grid grid-cols-2 grid-rows-3 h-full gap-[1px] bg-neutral-300">
                    {item.images.map((img, index) => (
                      <div key={index} className="overflow-hidden bg-white">
                        <img
                          src={img}
                          alt=""
                          className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-neutral-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-white/50 font-semibold text-sm uppercase tracking-wider">
              Our Process
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">
              How we bring your brand to life
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Discover",
                desc: "Deep dive into your brand, market, and audience to uncover key insights.",
              },
              {
                step: "02",
                title: "Strategize",
                desc: "Craft a positioning strategy that sets your brand apart from the competition.",
              },
              {
                step: "03",
                title: "Design",
                desc: "Bring the strategy to life with stunning visual design and identity systems.",
              },
              {
                step: "04",
                title: "Launch",
                desc: "Roll out your brand with confidence, supported by guidelines and assets.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-5xl font-bold text-white/10 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
