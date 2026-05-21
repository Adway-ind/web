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
  ChevronLeft,
} from "lucide-react";

import Client from "../components/ClientsSection";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import VideoSlide from "../assets/video/slide/video-slide-3.mp4";

import "swiper/css";

/* ───── Hero text slides (video is the shared background) ───── */
const heroSlides = [
  {
    title: "We craft brands",
    highlight: "that inspire",
  },
  {
    title: "Design that",
    highlight: "captures",
  },
  {
    title: "Strategy that",
    highlight: "elevates",
  },
  {
    title: "Identity that",
    highlight: "resonates",
  },
];

const services = [
  {
    icon: Target,
    title: "Brand Strategy",
    desc: "We uncover insights that define your brand's position and create a roadmap for meaningful growth.",
  },
  {
    icon: Palette,
    title: "Visual Identity",
    desc: "From logos to color systems, we design visual identities that capture your brand's essence.",
  },
  {
    icon: Layers,
    title: "Digital Design",
    desc: "Beautiful, intuitive digital experiences that connect with your audience on every screen.",
  },
  {
    icon: Zap,
    title: "Motion Graphics",
    desc: "Dynamic animations and motion design that bring your brand story to life.",
  },
  {
    icon: TrendingUp,
    title: "Brand Growth",
    desc: "Strategic brand evolution that scales with your business and resonates in new markets.",
  },
  {
    icon: Sparkles,
    title: "Brand Guidelines",
    desc: "Comprehensive brand books that ensure consistency across every touchpoint.",
  },
];

const portfolioItems = [
  {
    slug: "lumina-cosmetics",
    title: "Lumina Cosmetics",
    category: "Visual Identity",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
  },
  {
    slug: "techvault",
    title: "TechVault",
    category: "Brand Strategy",
    image:
      "https://plus.unsplash.com/premium_photo-1683121716061-3faddf4dc504?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVjaHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    slug: "ecogreen-living",
    title: "EcoGreen Living",
    category: "Digital Design",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  },
  {
    slug: "artisan-coffee",
    title: "Artisan Coffee Co.",
    category: "Visual Identity",
    image:
      "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGFydGlzdGljfGVufDB8fDB8fHww",
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

const stats = [
  { number: "200+", label: "Projects Delivered" },
  { number: "50+", label: "Happy Clients" },
  { number: "12+", label: "Years Experience" },
  { number: "15", label: "Design Awards" },
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
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  /* Auto-play */
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = heroSlides[current];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* 1. SINGLE SHARED VIDEO BACKDROP (Plays continuously across text shifts) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
        <video
          src={VideoSlide}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover scale-105"
        />

        {/* Dark Base Tint Overlay */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Advanced Cinematographic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 opacity-90" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] z-[1] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content Layer Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center flex flex-col items-center justify-center min-h-screen w-full">
        {/* TEXT CONTENT CAROUSEL LOOP */}
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-[1200ms] ease-in-out px-4 max-w-7xl mx-auto"
            style={{
              opacity: i === current ? 1 : 0,
              pointerEvents: i === current ? "auto" : "none",
              transform:
                i === current
                  ? "scale(1) translateY(0px)"
                  : "scale(0.98) translateY(15px)",
            }}
          >
            {/* Badge */}
            <div key={`badge-${current}`} className="animate-fade-in-up">
              <span className="inline-block px-4 py-2 bg-white/10 border border-white/20 text-white rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
                Award-Winning Branding Agency
              </span>
            </div>

            {/* Heading */}
            <h1
              key={`title-${current}`}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight animate-fade-in-up animation-delay-200 mx-auto"
            >
              {slide.title}
              <br />
              that <span className="gradient-text">{slide.highlight}</span>
            </h1>

            {/* Description */}
            <p
              key={`desc-${current}`}
              className="mt-8 text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed animate-fade-in-up animation-delay-400 mx-auto"
            >
              From strategy to visual identity, we create brand experiences that
              captivate audiences and drive business growth.
            </p>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-600 w-full">
              <Link
                to="/contact"
                className="group w-full sm:w-auto px-8 py-4 bg-white text-black rounded-md font-semibold text-lg hover:bg-white/90 transition-all duration-300 shadow-lg shadow-white/10 hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Start Your Project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/portfolio"
                className="group w-full sm:w-auto px-8 py-4 bg-white/10 text-white border border-white/20 rounded-md font-semibold text-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2"
              >
                View Our Work
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Slider nav arrows */}
            <div className="mt-14 flex items-center justify-center gap-4 w-full">
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white hover:border-white/40 transition-all duration-300 pointer-events-auto"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots (Uncomment if needed) */}
              {/* <div className="flex items-center justify-center gap-2 pointer-events-auto">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-500 ${
                  idx === current ? "w-8 bg-accent" : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div> */}

              <button
                onClick={next}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white hover:border-white/40 transition-all duration-300 pointer-events-auto"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 z-10 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-white/40 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}

/* ───── Home Page ───── */
export default function Home() {
  return (
    <>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Services Overview */}
      <section className="relative py-24 bg-black overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none mix-blend-screen animate-pulse duration-[6000ms]" />
        <div className="absolute bottom-1/4 right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/15 blur-[140px] pointer-events-none mix-blend-screen animate-pulse duration-[8000ms]" />
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full bg-fuchsia-500/10 blur-[100px] pointer-events-none mix-blend-screen" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Content */}
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

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="group relative p-8 rounded-2xl overflow-hidden border border-white/20 bg-gradient-to-br from-white/[0.07] to-white/[0.01] backdrop-blur-xl shadow-2xl shadow-black/40 hover:border-white/30 hover:from-white/[0.12] hover:to-white/[0.03] hover:-translate-y-1 transition-all duration-500"
              >
                {/* 1. Realistic Glass Grain/Texture Layer */}
                <div
                  className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none select-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />

                {/* 2. Soft Inner Gloss Highlights */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />

                {/* 3. Card Content */}
                <div className="relative z-10">
                  {/* Icon Wrapper with Layered Glass Effect */}
                  <div className="w-14 h-14 bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                    <service.icon className="w-7 h-7 text-white group-hover:text-black transition-colors" />
                  </div>

                  {/* Text Styling */}
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

          {/* Footer Link */}
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

      {/* Portfolio Preview */}
      <section className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-white/50 font-semibold text-sm uppercase tracking-wider">
                Our Work
              </span>
              <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-white tracking-tight">
                Featured projects
              </h2>
              <p className="mt-4 text-lg text-white/60 max-w-xl">
                A selection of brands we've helped build, transform, and grow.
              </p>
            </div>
            <Link
              to="/portfolio"
              className="group inline-flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all shrink-0"
            >
              View All Projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolioItems.map((item) => (
              <Link
                to={`/portfolio/${item.slug}`}
                key={item.title}
                className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <span className="text-white/60 text-sm font-medium">
                    {item.category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                    {item.title}
                  </h3>
                  <div className="mt-4 flex items-center gap-2 text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    View Project <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
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
