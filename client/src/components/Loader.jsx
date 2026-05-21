import { useState, useEffect } from "react";

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);

          setTimeout(() => {
            setFadeOut(true);

            setTimeout(() => {
              setVisible(false);
            }, 700);
          }, 300);

          return 100;
        }

        return prev + 1;
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  const letters = "adway".split("");

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black transition-opacity duration-700 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Brand Name */}
      <div className="flex items-center gap-2 sm:gap-4 mb-14">
        {letters.map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            className="text-5xl sm:text-8xl font-medium tracking-[0.15em] text-white opacity-0 animate-fade-letter"
            style={{
              animationDelay: `${index * 0.2}s`,
              animationFillMode: "forwards",
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Progress Line */}
      <div className="w-64 sm:w-96">
        <div className="mb-3 text-center text-[11px] uppercase tracking-[0.3em] text-white/30">
          Loading
        </div>

        <div className="h-[2px] bg-white/10 overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-75"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      {/* Large Percentage */}
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10">
        <span className="text-6xl sm:text-[8rem] font-black leading-none tracking-[-0.05em] text-white/10 select-none">
          {progress}%
        </span>
      </div>
    </div>
  );
}
