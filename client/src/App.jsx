import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import Career from "./pages/Career";
import PortfolioDetail from "./pages/PortfolioDetail";
import CustomCursor from "./custom/CustomCursor";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <CustomCursor />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/career" element={<Career />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
