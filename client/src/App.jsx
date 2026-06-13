import { Routes, Route, Outlet } from "react-router-dom";
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
import Clients from "./pages/Clients";
import PortfolioDetail from "./pages/PortfolioDetail";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import ChatBot from "./components/ChatBot";
import Loader from "./components/Loader";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Applications from "./pages/admin/Applications";
import Messages from "./pages/admin/Messages";
import ChatEnquiries from "./pages/admin/ChatEnquiries";
import AdminSettings from "./pages/admin/Settings";
import AdminPortfolio from "./pages/admin/Portfolio";
import AdminClients from "./pages/admin/Clients";
import CareerJobs from "./pages/admin/CareerJobs";
import ContactEnquiries from "./pages/admin/contact_enquiries";
import AdminBlog from "./pages/admin/Blog";
import "./App.css";

function App() {
  return (
    <AuthProvider>

      <div className="min-h-screen flex flex-col bg-black text-white">
        <Routes>
          {/* ═══ Public Routes ═══ */}
          <Route
            path="/*"
            element={
              <>
                <Loader />
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route
                      path="/portfolio/:slug"
                      element={<PortfolioDetail />}
                    />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/career" element={<Career />} />
                    <Route path="/apply" element={<Apply />} />
                    <Route path="/apply/:slug" element={<Apply />} />
                    <Route path="/social" element={<Social />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogDetail />} />
                  </Routes>
                </main>
                <Footer />
                <ChatBot />
              </>
            }
          />

          {/* ═══ Admin Login (no layout) ═══ */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ═══ Admin Panel (protected) ═══ */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="applications" element={<Applications />} />
            <Route path="career-jobs" element={<CareerJobs />} />
            <Route path="messages" element={<Messages />} />
            <Route path="chat-enquiries" element={<ChatEnquiries />} />
            <Route path="contact-enquiries" element={<ContactEnquiries />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="portfolio" element={<AdminPortfolio />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="blog" element={<AdminBlog />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
