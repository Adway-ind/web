import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { TransitionProvider } from "../src/custom/TransitionContext";
import ScrollToTop from "../src/custom/ScrollToTop";

// Analytics tracker component for SPA pageview tracking
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", import.meta.env.VITE_GA_ID || "", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <TransitionProvider>
        <AnalyticsTracker />
        <App />
      </TransitionProvider>
    </BrowserRouter>
  </StrictMode>,
);
