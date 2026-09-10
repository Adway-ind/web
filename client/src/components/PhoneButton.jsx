import { Phone } from "lucide-react";

const PhoneButton = () => {
  return (
    <a
      href="tel:+919876543210" // Replace with your phone number
      className="fixed bottom-44 sm:bottom-34 right-4 sm:right-10 z-30 group"
      aria-label="Call Us"
    >
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg transition-all duration-300 hover:scale-110">
        <Phone size={24} className="text-white" />

        {/* Ping Animation */}
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-30"></span>
      </div>

      {/* Tooltip */}
      <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-black px-3 py-1 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        Call Us
      </span>
    </a>
  );
};

export default PhoneButton;