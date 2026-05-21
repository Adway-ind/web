import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Filter } from "lucide-react";
import Video from "../assets/video/portfolio-one.mp4"


const categories = [
  "All",
  "Brand Strategy",
  "Visual Identity",
  "Digital Design",
  "Motion Graphics",
];

const projects = [
  {
    slug: "lumina-cosmetics",
    title: "Lumina Cosmetics",
    category: "Visual Identity",
    desc: "A complete visual identity overhaul for a premium cosmetics brand, including logo, packaging, and retail design.",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
    tags: ["Logo Design", "Packaging", "Brand Guidelines"],
  },
  {
    slug: "techvault",
    title: "TechVault",
    category: "Brand Strategy",
    desc: "Strategic brand positioning and identity development for a fintech startup entering a competitive market.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e15f92?w=800&q=80",
    tags: ["Strategy", "Positioning", "Naming"],
  },
  {
    slug: "ecogreen-living",
    title: "EcoGreen Living",
    category: "Digital Design",
    desc: "A full digital experience design including website, app, and e-commerce platform for sustainable living.",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
    tags: ["Web Design", "App Design", "E-commerce"],
  },
  {
    slug: "artisan-coffee",
    title: "Artisan Coffee Co.",
    category: "Visual Identity",
    desc: "Artisanal brand identity for a specialty coffee roaster, from logo to cafe interior design concepts.",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bc2035a5?w=800&q=80",
    tags: ["Logo Design", "Packaging", "Interior"],
  },
  {
    slug: "nova-fitness",
    title: "Nova Fitness",
    category: "Digital Design",
    desc: "Modern digital platform and brand experience for a next-generation fitness brand.",
    image:
      "https://images.unsplash.com/photo-1534438327606-49c30f3adafb?w=800&q=80",
    tags: ["Web Design", "App UI/UX", "Brand System"],
  },
  {
    slug: "skyline-realestate",
    title: "Skyline Real Estate",
    category: "Brand Strategy",
    desc: "Premium brand strategy and identity for a luxury real estate development company.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    tags: ["Strategy", "Visual Identity", "Collateral"],
  },
  {
    slug: "pulse-music",
    title: "Pulse Music",
    category: "Motion Graphics",
    desc: "Dynamic motion identity and animated brand assets for a music streaming platform.",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    tags: ["Logo Animation", "Motion Design", "Social"],
  },
  {
    slug: "harvest-kitchen",
    title: "Harvest Kitchen",
    category: "Visual Identity",
    desc: "Farm-to-table restaurant brand identity with handcrafted visual elements and earthy tones.",
    image:
      "https://images.unsplash.com/photo-1414235077428-33898c825008?w=800&q=80",
    tags: ["Logo Design", "Menu Design", "Signage"],
  },
  {
    slug: "vortex-gaming",
    title: "Vortex Gaming",
    category: "Motion Graphics",
    desc: "Electrifying motion brand and visual effects for an esports and gaming community platform.",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
    tags: ["Motion Identity", "Visual Effects", "Streaming Assets"],
  },
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-24 bg-black overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        {/* Background Video */}
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-2 bg-white/10 border border-white/20 text-white rounded-full text-sm font-medium mb-6">
            Our Portfolio
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-bold text-white leading-[1.05] tracking-[-0.02em]">
            Work that speaks
            <br />
            <span className="gradient-text">for itself</span>
          </h1>
          <p className="mt-6 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            Explore a curated selection of brands we've helped build, transform,
            and elevate to new heights.
          </p>
        </div>
      </section>

      {/* Filter + Projects */}
      <section className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            <Filter className="w-5 h-5 text-white/30 mr-2" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-white text-black shadow-lg"
                    : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project) => (
              <Link
                to={`/portfolio/${project.slug}`}
                key={project.slug}
                className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/25 hover:shadow-xl transition-all duration-500"
              >
                {/* Project Image */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="px-5 py-2.5 bg-white rounded-full text-black text-sm font-semibold flex items-center gap-2 shadow-lg">
                      View Project
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
                {/* Info */}
                <div className="p-6">
                  <span className="text-white/50 text-sm font-medium">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1 group-hover:text-white/90 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-white/50 text-sm mt-2 leading-relaxed">
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-white/5 text-white/60 rounded-full text-xs font-medium border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-white/30 text-lg">
                No projects found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Like what you see?
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Let's create something just as impressive for your brand.
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 mt-8 px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-white/90 transition-all duration-300 shadow-lg"
          >
            Start a Project
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  );
}
