import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import LogoWhite from "../assets/image/logo/adway-w-01.png";
import LogoBlack from "../assets/image/logo/adway-b-01.png";

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={LogoBlack}
              alt="Adway Creations"
              className="h-auto w-[150px] transition-all duration-300"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 pb-1.5
            after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-0 after:transition-all after:duration-300
    
    /* Global Hover: Make the line grow from the center to full width */
    hover:after:w-[60%]
    
    ${
      location.pathname === link.path
        ? scrolled
          ? "text-white  after:bg-white"
          : "text-white backdrop-blur-sm after:bg-white"
        : scrolled
          ? "text-white/60 hover:text-white  after:bg-white active:scale-95"
          : "text-white/80 hover:text-white  after:bg-white active:scale-95"
    }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="ml-4 px-6 py-2.5 bg-white text-black rounded-md text-sm font-semibold hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? "text-gray-700" : "text-white"
            }`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-black/95 backdrop-blur-md shadow-lg border-t border-white/10 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                location.pathname === link.path
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="block text-center mt-3 px-6 py-3 bg-white text-black rounded-xl text-sm font-semibold hover:bg-white/90 transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
