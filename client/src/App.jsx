import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import Career from "./pages/Career";
import Apply from "./pages/Apply";
import Social from "./pages/Social";
import PortfolioDetail from "./pages/PortfolioDetail";
import CustomCursor from "./custom/CustomCursor";
import ChatBot from "./components/ChatBot";
import Loader from "./components/Loader";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Loader />
      <Navbar />
      <main className="flex-1">
        <CustomCursor />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/career" element={<Career />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/apply/:slug" element={<Apply />} />
          <Route path="/social" element={<Social />} />
        </Routes>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}

export default App;
