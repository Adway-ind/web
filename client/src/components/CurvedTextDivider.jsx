import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

function DividerBanner() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Subtle movement
  const rawX1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const rawX2 = useTransform(scrollYProgress, [0, 1], [-50, 0]);

  // Smooth spring effect
  const x1 = useSpring(rawX1, {
    stiffness: 30,
    damping: 25,
    mass: 1,
  });

  const x2 = useSpring(rawX2, {
    stiffness: 30,
    damping: 25,
    mass: 1,
  });

  // Slight scale effect
  const scale = useTransform(scrollYProgress, [0, 1], [0.98, 1]);

  return (
    <section
      ref={ref}
      className="relative py-20 overflow-hidden bg-black"
    >
      {/* Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 blur-[120px]" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 blur-[120px]" />
      </div>

      {/* Top Ribbon */}
      <div className="relative rotate-[-4deg] scale-110 overflow-hidden">
        <div className="bg-white text-black shadow-2xl border-y border-black/10 py-6">
          <motion.div
            style={{ x: x1, scale }}
            className="flex w-max"
          >
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="mx-8 whitespace-nowrap text-3xl md:text-5xl font-black uppercase tracking-tight"
              >
                Branding • Web Design • UI/UX • Digital Marketing • SEO •
                Creative Strategy •
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Ribbon */}
      <div className="relative rotate-[4deg] scale-110 overflow-hidden mt-10">
        <div className="bg-white/10 backdrop-blur-xl border-y border-white/20 py-6">
          <motion.div
            style={{ x: x2, scale }}
            className="flex w-max"
          >
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="mx-8 whitespace-nowrap text-3xl md:text-5xl font-black uppercase tracking-tight text-white"
              >
                Adway Creations • Design That Performs • Creative Agency •
                Brand Identity •
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default DividerBanner;