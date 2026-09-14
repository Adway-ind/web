import { useEffect, useState } from "react";
import { useTransition } from "../custom/TransitionContext";

export default function AdwayLoader() {
  const { transitioning } = useTransition();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (transitioning) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [transitioning]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black
        transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]
        ${transitioning ? "translate-y-0 opacity-100" : "-translate-y-full opacity-100"}`}
    >
      <div className="flex flex-col items-center">
        
        {/* ADWAY */}
        <div
          className={`overflow-hidden transition-all duration-700 ease-out
            ${transitioning ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h1 className="font-poppins text-5xl md:text-7xl font-bold tracking-[0.25em] text-white">
            ADWAY
          </h1>
        </div>

        {/* Animated Line */}
        <div className="mt-6 h-[1px] w-48 overflow-hidden bg-white/20">
          <div
            className={`h-full bg-white transition-all duration-700 ease-out
              ${transitioning ? "w-full" : "w-0"}`}
          />
        </div>

      </div>
    </div>
  );
}