import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Users,
  Award,
  Heart,
  Lightbulb,
  Rocket,
  Palette,
  TrendingUp,
  Target,
  Gem,
} from "lucide-react";
import amalImage from "../assets/image/person/amal.jpeg";
import Adway from "../assets/image/person/adway.jpeg";
import Video from "../assets/video/softaurora.webm";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import CircularGallery from "../components/CircularGallery";
import SEO from "../components/SEO";

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

function LogoModel({ color }) {
  const { scene } = useGLTF("/shape.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        child.material.color.set(color);
        // Optional: preserve metalness/roughness from original
        // child.material.metalness = 0.3
        // child.material.roughness = 0.4
      }
    });
  }, [scene, color]);

  return (
    <primitive object={scene} scale={1.5} rotation={[0, Math.PI / 4, 0]} />
  );
}

export default function About() {
  const [color, setColor] = useState("#2563eb");
  return (
    <>
      <SEO
        title="About Adway - Our Story & Team | Branding Agency"
        description="Learn about Adway's journey, our passionate team of brand strategists and designers, and our mission to transform brands through creative excellence."
        keywords="about adway, branding team, brand strategists, creative agency, our story"
        url="/about"
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
              Adway Studio — About
            </span>
            <div className="flex-1 h-px bg-white/15" />
          </div>

          {/* Headline */}
          <h1
            className="font-medium   text-white leading-[1.0] tracking-[-0.03em]"
            style={{
              fontVariationSettings: "'opsz' 144",
              fontSize: "clamp(52px, 8vw, 88px)",
            }}
          >
            The story
            <br />  
            behind{" "}
            <em className="text-blue-500" style={{ fontStyle: "italic" }}>
              the brand.
            </em>
          </h1>

          <p className="mt-5 text-[15px] text-white/50 leading-relaxed max-w-sm font-light">
            We're a team of strategists, designers, and dreamers dedicated to
            building brands that make a lasting impact.
          </p>

          {/* Stats + scroll hint */}
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* LEFT CONTENT */}
            <div>
              <span className="text-black/50 font-semibold text-sm uppercase tracking-wider">
                Our Story
              </span>

              <h2 className="mt-4 text-4xl sm:text-5xl font-medium text-black tracking-tight leading-tight">
                Building brands since 2014
              </h2>

              <p className="mt-6 text-black text-lg text-justify leading-relaxed">
                At Adway, we help brands grow through creative digital
                marketing, branding, content creation, SEO, SEM, and eCommerce
                solutions. Based in Kochi, Kerala, we combine strategy,
                innovation, and design to build strong online experiences that
                drive real business growth.From startups and SMEs to global
                brands, Adway delivers personalized and cost-effective marketing
                solutions that attract, engage, and convert audiences. With a
                focus on creativity, performance, and results, we help
                businesses stand out in today's competitive digital
                landscape.Our journey began with a simple vision: to make
                world-class branding accessible to businesses of all sizes. Over
                the years, we've grown from a small studio into a full-service
                creative agency, serving clients across industries and
                geographies. Our team brings together diverse expertise in
                design, technology, marketing, and strategy, enabling us to
                deliver comprehensive solutions that address every aspect of
                brand development and growth.
              </p>

              {/* Color Picker */}
              {/* <div className="mt-8 flex items-center gap-3">
                <label className="text-sm text-gray-600">
                  Model color
                </label>

                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border"
                />

                <span className="text-sm font-mono text-gray-400">
                  {color}
                </span>
              </div> */}
            </div>

            {/* RIGHT 3D MODEL */}
            <div className="aspect-square rounded-3xl overflow-hidden hidden sm:flex ">
              <Canvas camera={{ position: [0, 0, 5], fov: 100 }}>
                {/* Lights */}
                <ambientLight intensity={1.2} />
                <directionalLight position={[5, 5, 5]} intensity={2} />

                {/* 3D Model */}
                <LogoModel color={color} />

                {/* Controls */}
                <OrbitControls
                  enableZoom={false}
                  autoRotate
                  autoRotateSpeed={2}
                />

                {/* Environment */}
                <Environment preset="city" />
              </Canvas>
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
            <p className="mt-4 text-lg text-white/60">
              Our core values shape every decision we make and every project we
              undertake. They guide our creative process, inform our client
              relationships, and define the culture we've built at Adway.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white transition-colors duration-300">
                  <v.icon
                    className={`w-7 h-7 ${v.color} group-hover:text-black transition-colors`}
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{v.title}</h3>
                <p className="text-white/50 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto mb-16">
            <span className="text-black/50 font-semibold text-sm uppercase tracking-wider">
              Our Team
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-medium text-black tracking-tight">
              The creative minds
            </h2>
            <p className="mt-4 text-2xl text-black text-center">
              A passionate team of strategists, designers, developers, and
              marketers dedicated to building remarkable brands through
              creativity and innovation.
            </p>
            <p className="mt-4 text-base text-black/60 max-w-2xl mx-auto"></p>
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
                <h3 className="text-lg font-bold text-black">{member.name}</h3>
                <p className="text-black/50 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-neutral-950">
        <div style={{ height: "600px", position: "relative" }}>
          <div className="w-full h-full grayscale">
            <CircularGallery
              bend={1}
              textColor="#ffffff"
              borderRadius={0.05}
              scrollSpeed={2}
              scrollEase={0.05}
            />
          </div>
        </div>
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
