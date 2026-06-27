import { useState, useEffect, useCallback, useRef } from "react";
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
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Client from "../components/ClientsSection";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import VideoSlide from "../assets/video/slide/video-slide-3.mp4";
import VideoSlide1 from "../assets/video/slide/video-slide.mp4";
import VideoSlide2 from "../assets/video/slide/video-slide-2.mp4";
import { API } from "../config/api";
import { useAuth } from "../context/AuthContext";
import Antigravity from "../components/Antigravity";
import SEO from "../components/SEO";
import BG from "../assets/video/bg.mp4";
import CurvedTextDivider from "../components/CurvedTextDivider";

import "swiper/css";

/* ───── Resolve image URL helper ───── */
const resolveImageUrl = (url) => {
  if (!url) return "";
  if (/^(?:https?:|blob:|data:)/.test(url)) return url;
  return `${API}${url}`;
};

/* ───── Hero slide data with videos ───── */
const heroSlides = [
  {
    video: VideoSlide1,
    title: "Digital",
    highlight: "Marketing",
    tagline: "01",
    paragraph:
      "We are a leading digital marketing agency with award-winning creative strategists and technologists.",
  },
  {
    video: VideoSlide2,
    title: "Strategic",
    highlight: "Consulting",
    tagline: "02",
    paragraph:
      "We specialize in establishing your brand and marketing strategy to attract consumers.",
  },
  {
    video: VideoSlide,
    title: "Creative",
    highlight: "Branding",
    tagline: "03",
    paragraph:
      "We are experts in logo design, packaging design, and brand communications design.",
  },
  {
    video: VideoSlide1,
    title: "Technology",
    highlight: "Solutions",
    tagline: "04",
    paragraph:
      "We have deep expertise in responsive web design and CMS web development.",
  },
];

const showcaseData = {
  featured: {
    id: 1,
    type: "image",
    image: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800",
    tag: "Brand Identity",
    title: "Meridian Visual Identity System",
  },
  gallery: {
    id: 2,
    type: "gallery",
    images: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400",
      "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400",
      "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=400",
    ],
  },
  insight1: {
    id: 3,
    type: "content",
    num: "01 — Strategy",
    title: "Brand positioning that cuts through noise",
    desc: "We identify the white space where your brand can own a unique and defensible position.",
    accent: "Discovery",
  },
  stat: {
    id: 4,
    type: "stat",
    number: "240+",
    label: "across 18 industries",
    tags: ["Identity", "Motion", "Digital", "Print"],
    desc: "From launch-stage startups to Fortune 500 rebrands.",
  },
  insight2: {
    id: 5,
    type: "content",
    num: "02 — Visual",
    title: "Systems built to scale with your ambition",
    desc: "Modular design systems that stay coherent across every touchpoint and medium.",
    accent: "Systems",
  },
  campaign: {
    id: 6,
    type: "image",
    image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800",
    tag: "Campaign",
    title: "Storytelling that builds lasting brand equity",
  },
  feature: {
    id: 7,
    type: "feature",
    title: "Measurable brand impact",
    desc: "Every creative decision is anchored in strategy and tested against real audience insight.",
  },
};

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

/* ───── Animation variants ───── */
const textVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, y: -30, transition: { duration: 0.4, ease: "easeIn" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
  exit: { transition: { staggerChildren: 0.06, staggerDirection: -1 } },
};

/* ───── Scroll fade-in wrapper ───── */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

function FadeIn({ children, delay = 0, className = "", direction = "up" }) {
  const dirMap = {
    up: { opacity: 0, y: 40 },
    down: { opacity: 0, y: -40 },
    left: { opacity: 0, x: 40 },
    right: { opacity: 0, x: -40 },
    none: { opacity: 0 },
  };
  return (
    <motion.div
      initial={dirMap[direction] ?? dirMap.up}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ───── Hero Slider Component ───── */
function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const total = heroSlides.length;
  const videoRefs = useRef([]);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const SLIDE_DURATION = 7000;

  const nextIndex = (current + 1) % total;

  const goTo = useCallback(
    (index) => {
      setCurrent(index);
      setProgress(0);
    },
    [],
  );

  const next = useCallback(() => goTo((current + 1) % total), [current, goTo]);

  /* Auto-play timer */
  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(elapsed / SLIDE_DURATION, 1));
    }, 30);
    timerRef.current = setTimeout(next, SLIDE_DURATION);
    return () => {
      clearTimeout(timerRef.current);
      clearInterval(progressRef.current);
    };
  }, [current, next]);

  /* Pause videos that aren't current */
  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (i === current) {
        vid.currentTime = 0;
        vid.play().catch(() => { });
      } else {
        vid.pause();
      }
    });
  }, [current]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* ── Background Videos ── */}
      {heroSlides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <video
            ref={(el) => (videoRefs.current[i] = el)}
            src={slide.video}
            className="absolute inset-0 w-full h-full object-cover"
            muted={isMuted}
            loop
            playsInline
            preload="auto"
          />
        </div>
      ))}

      {/* ── Dark Overlay ── */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/90 via-transparent to-black/40" />

      {/* ── Subtle grain texture ── */}
      <div
        className="absolute inset-0 z-[3] opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── Top nav bar area ── */}
      {/* <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-10 lg:px-16 py-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/60 text-xs sm:text-sm font-medium tracking-wider uppercase">
            Creative Agency
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-white/40 text-xs font-medium tracking-wider uppercase">
          <span className="text-white">{String(current + 1).padStart(2, "0")}</span>
          <span>/</span>
          <span>{String(total).padStart(2, "0")}</span>
        </div>
      </div> */}

      {/* ── Main Content ── */}
      <div className="relative z-20 h-full w-full flex flex-col justify-end px-6 sm:px-10 lg:px-16 pb-28 sm:pb-32">
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-end justify-between gap-10 lg:gap-16">
          {/* ── Left: Animated Text Content ── */}
          <div className="flex-1 max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col"
              >
                {/* Tagline */}
                <motion.span
                  variants={textVariants}
                  custom={0}
                  className="inline-flex items-center gap-3 mb-5"
                >
                  <span className="block w-10 h-[1px] bg-white/40" />
                  <span className="text-white/50 text-xs sm:text-sm font-semibold uppercase tracking-[0.3em]">
                    {heroSlides[current].tagline} — {heroSlides[current].highlight}
                  </span>
                </motion.span>

                {/* Title */}
                <motion.h1
                  variants={textVariants}
                  custom={1}
                  className="text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-bold text-white leading-[0.88] tracking-[-0.04em]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {heroSlides[current].title}
                  <span className="block mt-2 bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                    {heroSlides[current].highlight}
                  </span>
                </motion.h1>

                {/* Description */}
                <motion.p
                  variants={textVariants}
                  custom={2}
                  className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg text-white/50 max-w-md leading-relaxed font-light"
                >
                  {heroSlides[current].paragraph}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  variants={textVariants}
                  custom={3}
                  className="mt-8 flex flex-col sm:flex-row items-start gap-3 sm:gap-4"
                >
                  <Link
                    to="/contact"
                    className="group px-7 py-3.5 bg-white text-black rounded-2xl font-semibold text-sm hover:bg-white/90 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.08)] hover:shadow-[0_0_60px_rgba(255,255,255,0.15)] hover:-translate-y-0.5 flex items-center gap-2.5 "
                  >
                    Start Your Project
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/portfolio"
                    className="group px-7 py-3.5 rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-sm text-white font-semibold text-sm hover:bg-white/[0.1] hover:border-white/25 transition-all duration-300 flex items-center gap-2.5 hidden sm:flex"
                  >
                    View Our Work
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Right: Glassmorphism Next-Video Preview Card ── */}
          <div className="hidden lg:block flex-shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={nextIndex}
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => goTo(nextIndex)}
                className="group cursor-pointer w-[220px] xl:w-[260px] rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl shadow-2xl shadow-black/40 hover:border-white/[0.15] hover:bg-white/[0.07] transition-all duration-500"
              >
                {/* Preview video thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <video
                    src={heroSlides[nextIndex].video}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onMouseEnter={(e) => e.target.play().catch(() => { })}
                    onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {/* Play icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                      <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  {/* Up Next label */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white/70 text-[10px] font-semibold uppercase tracking-wider">
                      Up Next
                    </span>
                  </div>
                </div>
                {/* Card info */}
                <div className="p-4">
                  <p className="text-white/80 font-semibold text-sm">
                    {heroSlides[nextIndex].title}
                    <span className="text-white/40 font-normal ml-1.5">
                      {heroSlides[nextIndex].highlight}
                    </span>
                  </p>
                  <p className="text-white/30 text-xs mt-1.5 line-clamp-2">
                    {heroSlides[nextIndex].paragraph}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Bottom: Progress Indicators + Controls ── */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        {/* Progress bars */}
        <div className="flex items-center gap-1.5 px-6 sm:px-10 lg:px-16 pb-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="flex-1 h-[2px] rounded-full bg-white/10 overflow-hidden transition-all"
              aria-label={`Go to slide ${i + 1}`}
            >
              <div
                className="h-full rounded-full bg-white transition-none"
                style={{
                  width:
                    i < current
                      ? "100%"
                      : i === current
                        ? `${progress * 100}%`
                        : "0%",
                  transition: i === current ? "none" : "width 0.5s ease",
                }}
              />
            </button>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] bg-black/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-4 flex items-center justify-between">
            {/* Stats */}


            {/* Slide nav */}
            {/* <div className="flex items-center gap-4">
              <button
                onClick={() => goTo((current - 1 + total) % total)}
                className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.1] flex items-center justify-center transition-all"
                aria-label="Previous slide"
              >
                <ChevronRight className="w-4 h-4 text-white rotate-180" />
              </button>
              <button
                onClick={next}
                className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.1] flex items-center justify-center transition-all"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => setIsMuted((v) => !v)}
                className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.1] flex items-center justify-center transition-all ml-2"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white/60" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>
            </div> */}
          </div>
        </div>
      </div>
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
    <section className="relative overflow-hidden py-24 bg-black">
      <video
        src={BG}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/5" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/45 to-black/80" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeIn delay={0.1} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-white/70 font-semibold text-sm uppercase tracking-wider">
              Our Work
            </span>
            <h2 className="mt-4 text-4xl text-center sm:text-left sm:text-5xl font-bold text-white tracking-tight">
              Featured projects
            </h2>
            <p className="text-center sm:text-left mt-4 text-lg text-white/75 max-w-xl">
              A selection of brands we've helped build, transform, and grow.
            </p>
          </div>
          <Link
            to="/portfolio"
            className="group inline-flex items-center justify-center gap-2 text-white font-semibold hover:gap-3 transition-all shrink-0"
          >
            View All Projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </FadeIn>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="w-6 h-6 border-2 border-white/20 border-t-violet-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state — no featured projects yet */}
        {!loading && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-white/40" />
            </div>
            <div>
              <p className="text-white/85 font-medium">
                No featured projects yet
              </p>
              <p className="text-white/65 text-sm mt-1">
                Mark projects as featured in the admin panel to display them
                here.
              </p>
            </div>
            <Link
              to="/portfolio"
              className="mt-2 inline-flex items-center gap-2 text-sm text-violet-300 hover:text-violet-200 font-medium transition-colors"
            >
              Browse all projects <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && visibleProjects.length > 0 && (
          <>
            <FadeIn delay={0.2} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {visibleProjects.map((item, index) => (
                <FadeIn
                  key={item.id}
                  delay={0.15 + index * 0.08}
                  direction="up"
                  className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer bg-white shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <Link
                    to={`/portfolio/${item.slug || item.id}`}
                    className="block w-full h-full"
                  >
                    {/* Image */}
                    {item.image ? (
                      <img
                        src={resolveImageUrl(item.image)}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-300" />
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-all duration-500" />

                    {/* Featured Badge */}
                    <div className="absolute top-6 left-6 z-20">
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-semibold text-violet-700">
                        Featured
                      </span>
                    </div>

                    {/* Main Content */}
                    <div className="absolute bottom-0 left-0 right-0 z-20 p-8">

                      {/* Always Visible */}
                      <div className="transition-all duration-500 group-hover:-translate-y-24">
                        <span className="text-violet-300 text-sm font-medium">
                          {item.category}
                        </span>

                        <h3 className="text-3xl font-bold text-white mt-2">
                          {item.title}
                        </h3>
                      </div>

                      {/* Hidden Content */}
                      <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl p-8 translate-y-full group-hover:translate-y-0 transition-all duration-500">

                        {item.client && (
                          <p className="text-gray-600 text-sm">
                            Client: {item.client}
                          </p>
                        )}

                        {item.description && (
                          <p className="text-gray-500 text-sm mt-4 line-clamp-3">
                            {item.description}
                          </p>
                        )}

                        <div className="mt-6 flex items-center gap-2 text-violet-600 font-semibold">
                          View Project
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </FadeIn>

            {/* Show more / show less toggle */}
            {projects.length > 6 && (
              <FadeIn delay={0.35} className="mt-10 text-center">
                <button
                  onClick={() => setShowAll((v) => !v)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 text-sm font-semibold transition-all"
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
              </FadeIn>
            )}
          </>
        )}
      </div>
    </section>
  );
}

/* ───── Helper cards used in the expertise section ───── */
function ImageCard({ item, minHeight = "min-h-[260px]" }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[20px] border border-black/5 bg-neutral-100 ${minHeight} h-full`}
    >
      <img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

      <div className="absolute top-4 left-4 rounded-full bg-black/20 backdrop-blur-md border border-white/15 px-3 py-1">
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/75">
          Featured
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-[10px] tracking-[0.3em] uppercase text-white/60">
          {item.tag}
        </p>
        <h3 className="mt-2 text-lg font-medium text-white leading-tight">
          {item.title}
        </h3>
      </div>
    </div>
  );
}

function GalleryCard({ item }) {
  return (
    <div className="group relative overflow-hidden rounded-[20px] border border-black/5 bg-white h-full min-h-[280px]">
      <div className="absolute top-4 right-4 z-10 rounded-full bg-black/20 backdrop-blur-md border border-white/15 px-3 py-1">
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/75">
          Gallery
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1.5 p-1.5 h-full min-h-[280px]">
        {item.images.map((img, i) => (
          <div key={i} className="overflow-hidden rounded-[14px] bg-neutral-100">
            <img
              src={img}
              alt={`Gallery image ${i + 1}`}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentCard({ item }) {
  return (
    <div className="flex flex-col justify-center rounded-[20px] border border-black/5 bg-white px-8 py-10 h-full min-h-[220px]">
      <p className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 mb-4">
        {item.num}
      </p>
      <h3 className="text-xl font-medium text-neutral-900 leading-snug mb-3">
        {item.title}
      </h3>
      <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
      <div className="flex items-center gap-2.5 mt-5">
        <span className="w-7 h-0.5 bg-violet-500 rounded-full inline-block" />
        <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400">
          {item.accent}
        </span>
      </div>
    </div>
  );
}

function StatCard({ item }) {
  return (
    <div className="flex flex-col justify-between rounded-[20px] border border-black/5 bg-neutral-50 px-8 py-10 h-full min-h-[220px]">
      <div>
        <p className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 mb-3">
          Projects delivered
        </p>
        <p className="text-5xl font-medium text-neutral-900 leading-none">
          {item.number}
        </p>
        <p className="text-xs text-neutral-400 mt-1.5">{item.label}</p>
      </div>
      <div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block rounded-full border border-neutral-200 bg-white px-3 py-1 text-[11px] text-neutral-500"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed border-t border-neutral-200 pt-3">
          {item.desc}
        </p>
      </div>
    </div>
  );
}

function FeatureCard({ item }) {
  return (
    <div className="flex items-center rounded-[20px] border border-black/5 bg-white px-8 py-10 h-full min-h-[200px]">
      <div>
        <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center mb-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-neutral-500"
          >
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
        </div>
        <h3 className="text-base font-medium text-neutral-900 mb-2">
          {item.title}
        </h3>
        <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
      </div>
    </div>
  );
}

/* ───── Home Page ───── */
export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Adway",
    url: "https://adway.agency",
    logo: "https://adway.agency/favicon.svg",
    description: "Premium Branding & Digital Marketing Agency",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Creative Ave",
      addressLocality: "Design District",
      addressRegion: "NY",
      postalCode: "10001",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-123-4567",
      contactType: "Customer Service",
    },
    sameAs: [
      "https://facebook.com/adway",
      "https://instagram.com/adway",
      "https://linkedin.com/company/adway",
      "https://twitter.com/adway",
    ],
  };

  const marqueeServices = [...services, ...services];

  return (
    <>
      <style>{`
        @keyframes servicesMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
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
      <section className="relative py-20 bg-black overflow-hidden">
        {/* <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none mix-blend-screen animate-pulse duration-[6000ms]" />
        <div className="absolute bottom-1/4 right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/15 blur-[140px] pointer-events-none mix-blend-screen animate-pulse duration-[8000ms]" />
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full bg-fuchsia-500/10 blur-[100px] pointer-events-none mix-blend-screen" /> */}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-5xl mx-auto mb-16">
            <span className="text-white/50 font-semibold text-sm uppercase tracking-wider">
              What We Do
            </span>
            <h2 className="mt-4 text-3xl sm:text-5xl font-bold max-w-5xl mx-auto text-white tracking-tight">
              Services built for impact
            </h2>
            <p className="mt-4 text-base text-white/60 max-w-4xl mx-auto text-justify sm:text-center">
              We provide complete branding solutions that help businesses build
              strong, memorable brands. From brand strategy and visual identity
              design to digital marketing and web development, we create
              tailored solutions that drive growth, strengthen brand presence,
              and deliver measurable results.
            </p>
          </FadeIn>

          <FadeIn className="relative">
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black via-black/80 to-transparent z-20" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black via-black/80 to-transparent z-20" />
            <div className="overflow-hidden">
              <div
                className="flex w-max gap-6"
                style={{ animation: "servicesMarquee 32s linear infinite" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.animationPlayState = "paused";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.animationPlayState = "running";
                }}
              >
                {marqueeServices.map((service, idx) => (
                  <FadeIn
                    key={`${service.title}-${idx}`}
                    delay={(idx % services.length) * 0.04}
                  >
                    <div
                      className="group relative h-full min-h-[280px] p-8 rounded-2xl overflow-hidden border border-white/20 bg-gradient-to-br from-white/[0.07] to-white/[0.01] backdrop-blur-xl shadow-2xl shadow-black/40 hover:border-white/30 hover:from-white/[0.12] hover:to-white/[0.03] hover:-translate-y-1 transition-all duration-500 w-[320px] sm:w-[360px] shrink-0"
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
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn className="text-center mt-16 pb-8">
            <Link
              to="/services"
              className="group inline-flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all"
            >
              Explore All Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
      </section>

      <CurvedTextDivider />

      {/* ── Featured Portfolio (API-driven) ── */}
      <section className="pt-24 pb-8 bg-black">
        <FeaturedPortfolio />
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-4xl mx-auto mb-16">
            <span className="text-white/50 font-semibold text-sm uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-white tracking-tight">
              What our clients say
            </h2>
            <p className="mt-4 text-lg text-justify sm:text-center text-white/60">
              Don't just take our word for it. Here's what business owners and
              marketing leaders have to say about working with Adway. Our
              clients' success stories reflect our commitment to delivering
              exceptional branding and digital marketing solutions that drive
              real business growth.
            </p>
          </FadeIn>

          <FadeIn>
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
          </FadeIn>
        </div>
      </section>

      <Client />

      <section className="relative overflow-hidden bg-[#f7f5f2] py-20">
        {/* Subtle background texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,23,42,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.4) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <span className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-medium">
              Our Expertise
            </span>
            <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 max-w-md leading-[1.15]">
                Creative Branding Experience
              </h2>
              <div>
                <div className="hidden lg:block w-8 h-px bg-neutral-300 mb-3" />
                <p className="text-sm leading-7 text-neutral-500 max-w-xs">
                  We blend strategy, visual systems, storytelling, and digital
                  execution to build brands that move culture, not just trends.
                </p>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-12 gap-3">

            {/* Row 1 — Featured image (5 cols) + Gallery (7 cols) */}
            <div className="col-span-12 md:col-span-5">
              <ImageCard item={showcaseData.featured} minHeight="min-h-[280px]" />
            </div>

            <div className="col-span-12 md:col-span-7">
              <GalleryCard item={showcaseData.gallery} />
            </div>

            {/* Row 2 — Content (4) + Stat (4) + Content (4) */}
            <div className="col-span-12 md:col-span-4">
              <ContentCard item={showcaseData.insight1} />
            </div>

            <div className="col-span-12 md:col-span-4">
              <StatCard item={showcaseData.stat} />
            </div>

            <div className="col-span-12 md:col-span-4">
              <ContentCard item={showcaseData.insight2} />
            </div>

            {/* Row 3 — Wide image (7) + Feature (5) */}
            <div className="col-span-12 md:col-span-7">
              <ImageCard item={showcaseData.campaign} minHeight="min-h-[200px]" />
            </div>

            <div className="col-span-12 md:col-span-5">
              <FeatureCard item={showcaseData.feature} />
            </div>

          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative overflow-hidden bg-neutral-950 py-24 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-fuchsia-500/5 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-16">
            <div className="max-w-3xl">
              <span className="text-white/50 font-semibold text-sm uppercase tracking-[0.3em]">
                Our Process
              </span>
              <h2 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight">
                How we bring your brand to life
              </h2>
            </div>
            <p className="max-w-2xl text-base text-white/60 lg:text-left">
              Our proven four-step process keeps every project aligned,
              collaborative, and focused on results from discovery to launch.
            </p>
          </FadeIn>

          <div className="relative">
            <div className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent lg:block" />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  step: "01",
                  title: "Discover",
                  desc: "We study your market, audience, and goals to uncover the right direction.",
                },
                {
                  step: "02",
                  title: "Strategize",
                  desc: "We shape a clear story, positioning, and roadmap that fits your brand.",
                },
                {
                  step: "03",
                  title: "Design",
                  desc: "We craft bold visuals, systems, and experiences that bring the brand to life.",
                },
                {
                  step: "04",
                  title: "Launch",
                  desc: "We deliver, refine, and support the rollout so your brand grows with confidence.",
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.step}
                  className="group relative z-10 h-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm transition-all duration-500 hover:border-violet-400/30 hover:bg-white/[0.05]"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.6,
                    delay: idx * 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="flex items-center justify-between">
                    <motion.div
                      className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10"
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-base font-semibold text-white">
                        {item.step}
                      </span>
                      <span className="absolute inset-0 rounded-2xl border border-violet-400/10" />
                    </motion.div>
                    <span className="text-xs uppercase tracking-[0.35em] text-white/25">
                      Step {idx + 1}
                    </span>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-2xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-white/50">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <div className="h-px flex-1 bg-gradient-to-r from-white/0 via-white/10 to-white/0" />
                    <span className="ml-3 text-xs uppercase tracking-[0.3em] text-white/20">
                      0{idx + 1}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
