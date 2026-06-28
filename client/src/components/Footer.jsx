import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowUpRight, Heart } from "lucide-react";
import LogoWhite from "../assets/image/logo/adway-b-01.png"
import LogoBlack from "../assets/image/logo/adway-w-01.png"


export default function Footer() {
  return (
    <footer className="bg-white text-black">
      {/* CTA Section */}
      <div className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-medium text-black">
                Ready to elevate your brand?
              </h2>
              <p className="text-black/60 mt-2 text-lg">
                Let's create something extraordinary together.
              </p>
              <p className="text-black mt-2 text-base font-normal max-w-xl">
                Whether you're launching a new brand, refreshing an existing one, or looking to expand your digital presence, our team is ready to help you achieve your goals with strategic creativity and proven expertise.
              </p>
            </div>
            <Link
              to="/contact"
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-black/90 transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              Start a Project
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <img src={LogoBlack} alt="Adway Studio" className="h-auto w-50" />
            </Link>
            <p className="mt-4 text-black/80 text-[14px] font-normal leading-relaxed text-justify">
              We craft brands that resonate, inspire, and leave lasting
              impressions. Your vision, our expertise.
            </p>
            {/* <p className="mt-3 text-black/80 text-[14px] font-normal leading-relaxed text-justify">
              Adway is a full-service creative agency specializing in brand strategy, visual identity design, digital marketing, and web development. We partner with businesses worldwide to create compelling brand experiences that drive growth and build lasting customer relationships.
            </p> */}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-black mb-4">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", path: "/" },
                { label: "About Us", path: "/about" },
                { label: "Services", path: "/services" },
                { label: "Portfolio", path: "/portfolio" },
                { label: "Career", path: "/career" },
                { label: "Social", path: "/social" },
                { label: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-black hover:text-black/70 font-medium transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-black mb-4">
              Services
            </h4>
            <ul className="space-y-3">
              {[
                "Brand Strategy",
                "Visual Identity",
                "Digital Design",
                "Motion Graphics",
                "Brand Guidelines",
              ].map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="text-black hover:text-black/70 font-medium transition-colors duration-300"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-black mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-black/70 mt-0.5 shrink-0" />
                <span className="text-black font-medium">hello@adway.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-black/60 mt-0.5 shrink-0" />
                <span className="text-black font-medium">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-black/60 mt-0.5 shrink-0" />
                <span className="text-black font-medium">
                  123 Creative Ave, Design District, NY 10001
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <section className="relative overflow-hidden py-8 bg-black border-y border-white/10">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-black to-transparent" />
        <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-black to-transparent" />

        <div className="flex w-max animate-smooth-marquee">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center">
              {[
                "Brand Strategy",
                "Visual Identity",
                "UI/UX Design",
                "Web Development",
                "Creative Campaigns",
                "Digital Experiences",
                "Motion Graphics",
                "Social Media Design",
                "E-Commerce Solutions",
                "SEO Optimization",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center shrink-0"
                >
                  <span className="px-10 text-2xl md:text-4xl font-semibold tracking-[0.15em] uppercase text-white/90">
                    {item}
                  </span>

                  <div className="h-2 w-2 rounded-full bg-white/30" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      <div className="mt-16 mb-4 text-center">
        <h2 className="text-6xl md:text-8xl lg:text-[25rem] font-black tracking-tighter text-black/10 select-none">
          ADWAY
        </h2>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-black/50 text-sm font-medium">
              &copy; {new Date().getFullYear()} Adway. All rights reserved.
            </p>
            <p className="text-black/50 text-sm flex items-center font-medium gap-1">
              created by <span>
                <img src={LogoBlack} alt="Adway Studio" className="h-auto w-12" />
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
