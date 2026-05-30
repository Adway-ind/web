export default function ClientsSection() {
  const clients = [
    {
      name: "Nexora",
      logo: (
        <svg viewBox="0 0 120 40" className="h-9 w-auto text-black">
          <polygon
            points="10,32 20,8 30,32"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <polygon
            points="22,32 32,8 42,32"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
            strokeLinejoin="round"
            opacity="0.5"
          />
          <text
            x="50"
            y="27"
            fill="black"
            fontSize="18"
            fontWeight="700"
            fontFamily="Inter, sans-serif"
          >
            Nexora
          </text>
        </svg>
      ),
    },
    {
      name: "Lumio",
      logo: (
        <svg viewBox="0 0 110 40" className="h-9 w-auto text-black">
          <circle
            cx="16"
            cy="20"
            r="10"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
          />
          <circle cx="16" cy="20" r="4" fill="black" />
          <line
            x1="16"
            y1="6"
            x2="16"
            y2="10"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <text
            x="34"
            y="27"
            fill="black"
            fontSize="18"
            fontWeight="700"
            fontFamily="Inter, sans-serif"
          >
            Lumio
          </text>
        </svg>
      ),
    },
    {
      name: "Vantara",
      logo: (
        <svg viewBox="0 0 130 40" className="h-9 w-auto text-black">
          <path
            d="M8 30 L18 10 L28 30"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M22 30 L32 10 L42 30"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <text
            x="50"
            y="27"
            fill="black"
            fontSize="18"
            fontWeight="700"
            fontFamily="Inter, sans-serif"
          >
            Vantara
          </text>
        </svg>
      ),
    },
    {
      name: "Prismo",
      logo: (
        <svg viewBox="0 0 120 40" className="h-9 w-auto text-black">
          <rect
            x="8"
            y="10"
            width="16"
            height="16"
            rx="2"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
            transform="rotate(45 16 18)"
          />
          <text
            x="34"
            y="27"
            fill="black"
            fontSize="18"
            fontWeight="700"
            fontFamily="Inter, sans-serif"
          >
            Prismo
          </text>
        </svg>
      ),
    },
    {
      name: "Arcova",
      logo: (
        <svg viewBox="0 0 120 40" className="h-9 w-auto text-black">
          <path
            d="M6 28 Q16 4 26 28"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="16" cy="22" r="3" fill="black" />
          <text
            x="34"
            y="27"
            fill="black"
            fontSize="18"
            fontWeight="700"
            fontFamily="Inter, sans-serif"
          >
            Arcova
          </text>
        </svg>
      ),
    },
    {
      name: "Stellix",
      logo: (
        <svg viewBox="0 0 120 40" className="h-9 w-auto text-black">
          <polygon
            points="16,6 19,16 30,16 21,22 24,32 16,26 8,32 11,22 2,16 13,16"
            fill="none"
            stroke="black"
            strokeWidth="2"
          />
          <text
            x="36"
            y="27"
            fill="black"
            fontSize="18"
            fontWeight="700"
            fontFamily="Inter, sans-serif"
          >
            Stellix
          </text>
        </svg>
      ),
    },
    {
      name: "Klove",
      logo: (
        <svg viewBox="0 0 110 40" className="h-9 w-auto text-black">
          <path
            d="M16 30 L16 14 Q16 8 22 8 Q28 8 28 14 Q28 20 16 26"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <text
            x="34"
            y="27"
            fill="black"
            fontSize="18"
            fontWeight="700"
            fontFamily="Inter, sans-serif"
          >
            Klove
          </text>
        </svg>
      ),
    },
    {
      name: "Orizon",
      logo: (
        <svg viewBox="0 0 120 40" className="h-9 w-auto text-black">
          <ellipse
            cx="18"
            cy="20"
            rx="12"
            ry="6"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
          />
          <line
            x1="6"
            y1="20"
            x2="30"
            y2="20"
            stroke="black"
            strokeWidth="1.5"
          />
          <circle cx="18" cy="20" r="2" fill="black" />
          <text
            x="36"
            y="27"
            fill="black"
            fontSize="18"
            fontWeight="700"
            fontFamily="Inter, sans-serif"
          >
            Orizon
          </text>
        </svg>
      ),
    },
  ];

  /* Double the list for seamless loop */
  const marqueeClients = [...clients, ...clients];

  return (
    <section className="py-24 bg-white overflow-hidden">
      {/* Heading */}
      <div className="max-w-3xl mx-auto text-center mb-14 px-4">
        <span className="text-black/50 font-semibold text-sm uppercase tracking-wider">
          Trusted By
        </span>
        <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-black tracking-tight">
          Brands that believe in bold
        </h2>
        <p className="mt-4 text-black/60 text-lg max-w-xl mx-auto leading-relaxed">
          From startups to global enterprises, we've helped visionary teams
          build identities that endure.
        </p>
      </div>

      {/* Marquee row */}
      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

        <div className="flex animate-marquee-right">
          {marqueeClients.map((client, i) => (
            <div key={i} className="group flex-shrink-0 mx-4 sm:mx-6">
              <div className="flex items-center justify-center px-8 py-5 rounded-2xl bg-white/5 border border-white/10 shadow-sm hover:shadow-md hover:border-white/25 transition-all duration-300 text-white/40 hover:text-white [&_svg]:transition-colors duration-300">
                {client.logo}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
