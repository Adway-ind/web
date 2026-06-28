import { Link } from "react-router-dom";
import {
  ArrowRight,
  Palette,
  Target,
  Zap,
  Layers,
  SquareCode,
  TrendingUp,
  Sparkles,
  Monitor,
  PenTool,
  Film,
  CheckCircle2,
} from "lucide-react";

import Video from "../assets/video/service-one.mp4";
import SEO from "../components/SEO";

const services = [
  {
    icon: Target,
    title: "Brand Strategy",
    desc: "We dig deep into your market, audience, and competitive landscape to define a brand positioning that sets you apart. Our strategic frameworks ensure your brand resonates with the right people at the right time.",
    features: [
      "Market Research & Analysis",
      "Brand Positioning",
      "Audience Profiling",
      "Competitive Audit",
      "Brand Architecture",
    ],
    image:
      "https://img.magnific.com/premium-photo/light-bulb-photo-with-brand-concept-words-black-background_1208970-61788.jpg?uid=R138009327&ga=GA1.1.1010247763.1779271943&semt=ais_hybrid&w=740&q=80",
  },
  {
    icon: Palette,
    title: "Visual Identity",
    desc: "From logos to comprehensive design systems, we create visual identities that are distinctive, memorable, and flexible enough to grow with your brand across every touchpoint.",
    features: [
      "Logo Design",
      "Color Systems",
      "Typography Selection",
      "Iconography",
      "Design Systems",
    ],
    image:
      "https://img.magnific.com/premium-photo/innovative-branding-concept-tech-startup-featuring-sleek-modern-design-elements-including_145776-134886.jpg?uid=R138009327&ga=GA1.1.1010247763.1779271943&semt=ais_hybrid&w=740&q=80",
  },
  {
    icon: SquareCode,
    title: "Web Development",
    desc: "We build fast, scalable, and high-performing websites and web applications that deliver seamless user experiences while driving business growth and digital success.",
    features: [
      "Custom Website Development",
      "E-Commerce Development",
      "CMS Development",
      "Frontend & Backend Development",
      "Performance Optimization",
    ],
    image:
      "https://img.magnific.com/free-photo/programming-background-collage_23-2149901789.jpg?uid=R138009327&ga=GA1.1.1010247763.1779271943&semt=ais_hybrid&w=740&q=80",
  },
  {
    icon: Film,
    title: "Motion Graphics",
    desc: "Dynamic animations and motion design that bring your brand story to life. From logo animations to social media content, we create movement that captivates.",
    features: [
      "Logo Animation",
      "Social Media Motion",
      "Explainer Videos",
      "Brand Films",
      "Animated Assets",
    ],
    image:
      "https://img.magnific.com/premium-photo/video-editors-hands-control-surface-keyboard-multiple-monitors-with-editing-software-soft-backlighting-creating-depth_1299130-31438.jpg?uid=R138009327&ga=GA1.1.1010247763.1779271943&semt=ais_hybrid&w=740&q=80",
  },
  {
    icon: TrendingUp,
    title: "Brand Growth",
    desc: "Strategic brand evolution that scales with your business. Whether you're entering new markets or refreshing your presence, we ensure your brand stays relevant and impactful.",
    features: [
      "Brand Evolution Strategy",
      "Market Expansion",
      "Rebranding",
      "Sub-brand Development",
      "Brand Audits",
    ],
    image:
      "https://img.magnific.com/free-photo/dynamic-data-visualization-3d_23-2151904313.jpg?uid=R138009327&ga=GA1.1.1010247763.1779271943&semt=ais_hybrid&w=740&q=80",
  },
  {
    icon: Sparkles,
    title: "Brand Guidelines",
    desc: "Comprehensive brand books and guidelines that empower your team to maintain brand consistency across every channel and touchpoint.",
    features: [
      "Brand Books",
      "Usage Guidelines",
      "Template Systems",
      "Asset Libraries",
      "Training Materials",
    ],
    image:
      "https://img.magnific.com/free-vector/brand-manual-template-design_23-2149878165.jpg?t=st=1779352765~exp=1779356365~hmac=c305ec4b8cb643092eb2f86384e3cd6542f57b638df2a786a65fee24cd7e4d5d&w=1060",
  },
];

const process = [
  {
    step: "01",
    title: "Discovery",
    desc: "Deep research into your brand, market, competitors, and audience to uncover critical insights that will shape the strategy.",
  },
  {
    step: "02",
    title: "Strategy",
    desc: "Define your brand positioning, messaging framework, and strategic direction based on research findings.",
  },
  {
    step: "03",
    title: "Design",
    desc: "Explore creative concepts and refine them into a cohesive visual identity that brings the strategy to life.",
  },
  {
    step: "04",
    title: "Refine",
    desc: "Iterate on designs with your feedback, testing and polishing every detail until perfection is achieved.",
  },
  {
    step: "05",
    title: "Deliver",
    desc: "Receive a complete brand package with guidelines, assets, and everything needed to launch with confidence.",
  },
];

export default function Services() {
  return (
    <>
      <SEO
        title="Our Services - Branding, Digital Marketing & Web Development | Adway"
        description="Explore Adway's comprehensive services: brand strategy, visual identity, digital design, motion graphics, and brand growth solutions for modern businesses."
        keywords="branding services, digital marketing, web development, visual identity, brand strategy, motion graphics"
        url="/services"
      />
      {/* Hero */}
      <section className="relative bg-black pt-32 pb-20 overflow-hidden">
        {/* Background video — dimmed */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        >
          <source src={Video} type="video/mp4" />
        </video>

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
            className="font-medium text-center text-white leading-[1.0] tracking-[-0.03em]"
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

          <p className="mt-5 text-[15px] text-center text-white/50 leading-relaxed max-w-7xl font-light">
            From strategy to execution, we provide a complete suite of branding
            services to help you stand out in a crowded marketplace.
          </p>

          {/* Stats + scroll hint */}
        </div>
      </section>

      {/* Services Detail */}
      <section>
        {services.map((service, i) => (
          <div
            key={service.title}
            className={`w-full py-24 ${i % 2 === 0 ? "bg-white" : "bg-neutral-950"
              }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${i % 2 === 1 ? "lg:direction-rtl" : ""
                  }`}
              >
                {/* Content */}
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${i % 2 === 0 ? "bg-black/10" : "bg-white/10"
                      }`}
                  >
                    <service.icon
                      className={`w-8 h-8 ${i % 2 === 0 ? "text-black/70" : "text-white/70"
                        }`}
                    />
                  </div>

                  <h3
                    className={`text-3xl sm:text-4xl font-medium tracking-tight ${i % 2 === 0 ? "text-black" : "text-white"
                      }`}
                  >
                    {service.title}
                  </h3>

                  <p
                    className={`mt-4 text-lg leading-relaxed ${i % 2 === 0 ? "text-black/70" : "text-white/60"
                      }`}
                  >
                    {service.desc}
                  </p>

                  <ul className="mt-6 space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircle2
                          className={`w-5 h-5 shrink-0 ${i % 2 === 0 ? "text-black/40" : "text-white/40"
                            }`}
                        />
                        <span
                          className={
                            i % 2 === 0 ? "text-black/80" : "text-white/70"
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Image */}
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Process */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto mb-16">
            <span className="text-black/50 font-semibold text-sm uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-medium text-black tracking-tight">
              Our proven process
            </h2>
            <p className="mt-4 text-lg text-black/60">
              A structured approach that ensures exceptional results every time.
            </p>
            <p className="mt-4 text-base text-black/50 max-w-2xl mx-auto">
              Our five-step process has been refined through years of experience
              and hundreds of successful projects. Each phase is designed to
              build upon the previous one, creating a solid foundation for your
              brand's success. We maintain transparent communication throughout,
              keeping you informed and involved at every stage of the journey.
            </p>
          </div>

          <div className="space-y-8">
            {/* First Row - 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {process.slice(0, 3).map((p) => (
                <div
                  key={p.step}
                  className="group relative rounded-3xl bg-black border border-white/10 p-8 text-center overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:border-white/20"
                >
                  {/* Glow Effect */}
                  <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-white/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Step Number */}
                  <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <span className="text-2xl font-bold text-white">
                      {p.step}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 text-xl font-bold text-white">
                    {p.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-white/60">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Second Row - 2 Centered Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:w-2/3 mx-auto">
              {process.slice(3).map((p) => (
                <div
                  key={p.step}
                  className="group relative rounded-3xl bg-black border border-white/10 p-8 text-center overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:border-white/20"
                >
                  {/* Glow Effect */}
                  <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-white/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Step Number */}
                  <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <span className="text-2xl font-bold text-white">
                      {p.step}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 text-xl font-bold text-white">
                    {p.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-white/60">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-neutral-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Ready to transform your brand?
          </h2>
          <p className="mt-4 text-lg text-white/50">
            Let's discuss which services are right for you.
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 mt-8 px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-white/90 transition-all duration-300 shadow-lg"
          >
            Schedule a Call
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  );
}
