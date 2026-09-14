import { useEffect, useState } from "react";

export default function InitialLoader() {
  const [loading, setLoading] = useState(true);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    // Wait until the page is ready
    const handleLoad = () => {
      setTimeout(() => {
        setHide(true);

        setTimeout(() => {
          setLoading(false);
        }, 700);
      }, 500);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);

      return () => {
        window.removeEventListener("load", handleLoad);
      };
    }
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`
        fixed inset-0 z-[999999]
        flex items-center justify-center
        bg-black
        transition-transform
        duration-700
        ease-[cubic-bezier(0.76,0,0.24,1)]
        ${hide ? "-translate-y-full" : "translate-y-0"}
      `}
    >
      <div className="flex flex-col items-center">

        {/* ADWAY */}
        <h1
          className="
            font-poppins
            text-5xl
            md:text-7xl
            font-bold
            tracking-[0.25em]
            text-white
          "
        >
          ADWAY
        </h1>

        {/* Small animated line */}
        <div className="mt-5 h-[1px] w-40 overflow-hidden bg-white/20">
          <div className="h-full w-full bg-white animate-loader-line" />
        </div>

      </div>
    </div>
  );
}