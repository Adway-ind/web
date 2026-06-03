import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { TransitionProvider } from "../src/custom/TransitionContext";
import ScrollToTop from "../src/custom/ScrollToTop";
import { pageview } from "../scripts/analytics";

// Analytics tracker component for SPA pageview tracking
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    pageview(location.pathname + location.search);
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
