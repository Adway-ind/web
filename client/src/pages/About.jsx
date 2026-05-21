import { Link } from "react-router-dom";
import {
  ArrowRight,
  Users,
  Award,
  Heart,
  Lightbulb,
  Rocket,
  Palette ,
  TrendingUp,
  Target,
  Gem,
} from "lucide-react";
import amalImage from "../assets/image/person/amal.jpeg";
import Adway from "../assets/image/person/adway.jpeg";
import Video from "../assets/video/about-one.mp4";

const team = [
  { name: "Anadhu", role: "Brand Strategist", image: Adway },
  { name: "Sony", role: "Lead Designer", image: Adway },
  { name: "Amal P Anil", role: "Creative Developer", image: amalImage },
];

const values = [
  {
    icon: Heart,
    color: "text-blue-500",
    title: "Passion-Driven",
    desc: "Every project is fueled by genuine passion for great design and brand storytelling.",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    color: "text-purple-500",
    desc: "We push creative boundaries and embrace new approaches to solve brand challenges.",
  },
  {
    icon: Target,
    title: "Purpose-Led",
    color: "text-emerald-500",
    desc: "Design with intention. Every element serves a strategic purpose for your brand's growth.",
  },
  {
    icon: Gem,
    title: "Quality Obsessed",
    color: "text-orange-500",
    desc: "We hold ourselves to the highest standards because your brand deserves nothing less.",
  },
];


const milestones = [
  {
    year: "2014",
    event: "Founded Adway Studio with a vision to transform brands",
  },
  { year: "2016", event: "Expanded to digital design and web experiences" },
  { year: "2018", event: "Won our first international design award" },
  { year: "2020", event: "Grew to a team of 15 talented creatives" },
  { year: "2022", event: "Opened second studio in London" },
  { year: "2024", event: "Reached 200+ projects delivered worldwide" },
];

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[600px] overflow-hidden bg-black">
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

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-4 py-2 bg-white/10 border border-white/20 text-white rounded-full text-sm font-medium mb-6">
              About Us
            </span>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-bold text-white leading-[1.05] tracking-[-0.02em]">
              The story behind
              <br />
              <span className="gradient-text">the brand</span>
            </h1>

            <p className="mt-6 text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
              We're a team of strategists, designers, and dreamers dedicated to
              building brands that make a lasting impact.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-white/50 font-semibold text-sm uppercase tracking-wider">
                Our Story
              </span>
              <h2 className="mt-4 text-4xl sm:text-5xl font-medium text-white tracking-tight">
                Building brands since 2014
              </h2>
              <p className="mt-6 text-white/60 text-lg leading-relaxed">
                Adway was born from a simple belief: every business deserves a
                brand that truly represents who they are. What started as a
                small design studio has grown into a full-service branding
                agency trusted by startups and enterprises alike.
              </p>
              <p className="mt-4 text-white/60 text-lg leading-relaxed">
                Over the past decade, we've helped over 200 brands find their
                voice, define their visual identity, and connect with their
                audiences in meaningful ways. Our approach combines strategic
                thinking with bold creative execution.
              </p>
              <div className="mt-8 flex gap-8">
                <div>
                  <div className="text-4xl font-bold text-white">12+</div>
                  <div className="text-sm text-white/40 mt-1">
                    Years of Experience
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white">200+</div>
                  <div className="text-sm text-white/40 mt-1">
                    Brands Transformed
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white">15</div>
                  <div className="text-sm text-white/40 mt-1">
                    Design Awards
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-white/10 via-purple-500/5 to-blue-500/10 flex items-center justify-center">
                <div className="text-center">
                  <Users className="w-20 h-20 text-white/40 mx-auto mb-4" />
                  <p className="text-2xl font-bold text-white">15 Creatives</p>
                  <p className="text-white/50">One Vision</p>
                </div>
              </div>
              {/* Decorative */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-2xl -z-10" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/5 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-white/50 font-semibold text-sm uppercase tracking-wider">
              Our Values
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-medium text-white tracking-tight">
              What drives us forward
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white transition-colors duration-300">
                  <v.icon className={`w-7 h-7 ${v.color} group-hover:text-black transition-colors`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{v.title}</h3>
                <p className="text-white/50 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-white/50 font-semibold text-sm uppercase tracking-wider">
              Our Team
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-medium text-white tracking-tight">
              The creative minds
            </h2>
            <p className="mt-4 text-lg text-white/60">
              A diverse team of experts passionate about building remarkable
              brands.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="group text-center">
                <div className="aspect-square rounded-2xl mb-6 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-lg font-bold text-white">{member.name}</h3>
                <p className="text-white/50 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-white/50 font-semibold text-sm uppercase tracking-wider">
              Our Journey
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-medium text-white tracking-tight">
              Milestones along the way
            </h2>
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/10 -translate-x-1/2" />

            {milestones.map((m, i) => (
              <div
                key={m.year}
                className={`relative flex items-start gap-8 mb-12 last:mb-0 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div
                  className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"} hidden md:block`}
                >
                  <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <div className="text-white font-bold text-lg">{m.year}</div>
                    <p className="text-white/60 mt-1">{m.event}</p>
                  </div>
                </div>
                <div className="relative z-10 w-8 h-8 bg-white rounded-full border-4 border-black shadow-md shrink-0 hidden md:block" />
                <div className="flex-1 hidden md:block" />

                {/* Mobile view */}
                <div className="flex gap-4 md:hidden">
                  <div className="relative z-10 w-8 h-8 bg-white rounded-full border-4 border-black shadow-md shrink-0 mt-1" />
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex-1">
                    <div className="text-white font-bold">{m.year}</div>
                    <p className="text-white/60 text-sm mt-1">{m.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-neutral-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-medium text-white tracking-tight">
            Want to be our next success story?
          </h2>
          <p className="mt-4 text-lg text-white/50">
            Let's collaborate and build something amazing together.
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 mt-8 px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-white/90 transition-all duration-300 shadow-lg"
          >
            Get in Touch
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  );
}
