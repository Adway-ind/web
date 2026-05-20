import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowUpRight, Heart } from "lucide-react";
import LogoWhite from "../assets/image/logo/adway-b-01.png"

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      {/* CTA Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-medium">
                Ready to elevate your brand?
              </h2>
              <p className="text-white/60 mt-2 text-lg">
                Let's create something extraordinary together.
              </p>
            </div>
            <Link
              to="/contact"
              className="group flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-full font-semibold hover:bg-accent-dark transition-all duration-300 shadow-lg hover:shadow-xl btn-shine"
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
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">Adway</span>
            </Link>
            <p className="mt-4 text-white/50 leading-relaxed">
              We craft brands that resonate, inspire, and leave lasting
              impressions. Your vision, our expertise.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", path: "/" },
                { label: "About Us", path: "/about" },
                { label: "Services", path: "/services" },
                { label: "Portfolio", path: "/portfolio" },
                { label: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/60 hover:text-accent transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
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
                    className="text-white/60 hover:text-accent transition-colors duration-300"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <span className="text-white/60">hello@adway.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <span className="text-white/60">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <span className="text-white/60">
                  123 Creative Ave, Design District, NY 10001
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-16 mb-4 text-center">
        <h2 className="text-6xl md:text-8xl lg:text-[25rem] font-black tracking-tighter text-white/10 select-none">
          ADWAY
        </h2>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              &copy; {new Date().getFullYear()} Adway. All rights reserved.
            </p>
            <p className="text-white/40 text-sm flex items-center gap-1">
              created by <span>
                <img src={LogoWhite} alt="Adway Studio" className="h-auto w-12" />
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
