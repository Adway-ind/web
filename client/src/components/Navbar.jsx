import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import LogoBlack from "../assets/image/logo/adway-b-01.png";
import { useTransition } from "../custom/TransitionContext";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/services", label: "Services" },
  { path: "/portfolio", label: "Portfolio" },
  { path: "/career", label: "Career" },
  { path: "/social", label: "Social" },
  { path: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { navigateTo } = useTransition();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Disable body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNav = (e, path) => {
    e.preventDefault();
    setIsOpen(false);
    navigateTo(path);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-black/95 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <a
            href="/"
            onClick={(e) => handleNav(e, "/")}
            className="flex items-center gap-2 group"
          >
            <img
              src={LogoBlack}
              alt="Adway Creations"
              className="h-auto w-[150px] transition-all duration-300"
            />
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleNav(e, link.path)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 pb-1.5
                  after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-0 after:transition-all after:duration-300
                  hover:after:w-[60%]
                  ${location.pathname === link.path
                    ? scrolled
                      ? "text-white after:bg-white"
                      : "text-white backdrop-blur-sm after:bg-white"
                    : scrolled
                      ? "text-white/60 hover:text-white after:bg-white active:scale-95"
                      : "text-white/80 hover:text-white after:bg-white active:scale-95"
                  }`}
              >
                {link.label}
              </a>
            ))}

            <a
              href="/contact"
              onClick={(e) => handleNav(e, "/contact")}
              className="ml-4 px-6 py-2.5 bg-white text-black rounded-md text-sm font-semibold hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Get Started
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? "text-gray-700" : "text-white"
              }`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile sidebar */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-neutral-950 border-l border-white/10 z-50 transform transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <img
            src={LogoBlack}
            alt="Adway Creations"
            className="h-auto w-[120px] brightness-0 invert"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Sidebar navigation */}
        <div className="px-6 py-8 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
          {navLinks.map((link, index) => (
            <a
              key={link.path}
              href={link.path}
              onClick={(e) => handleNav(e, link.path)}
              className={`group flex items-center justify-between px-4 py-4 rounded-xl text-base font-medium transition-all duration-300 ${
                location.pathname === link.path
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
              style={{
                animationDelay: `${index * 50}ms`,
                animation: isOpen ? "slideInRight 0.4s ease-out forwards" : "none",
              }}
            >
              <span>{link.label}</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* Sidebar footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 bg-neutral-950">
          <a
            href="/contact"
            onClick={(e) => handleNav(e, "/contact")}
            className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-white text-black rounded-xl text-sm font-semibold hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-center text-white/40 text-xs mt-4">
            © 2026 Adway Creations
          </p>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </nav>
  );
}