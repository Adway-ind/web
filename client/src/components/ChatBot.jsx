import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { API } from "../config/api";

const serviceOptions = [
  "Website Development",
  "Branding & Logo Design",
  "Social Media Marketing",
  "SEO Services",
  "Video Production",
];

const projectTypeOptions = {
  "Website Development": [
    "Business Website",
    "E-commerce Store",
    "Portfolio Website",
    "Landing Page",
  ],
  "Branding & Logo Design": [
    "Logo Design",
    "Brand Identity",
    "Rebrand / Refresh",
    "Packaging Design",
  ],
  "Social Media Marketing": [
    "Content Creation",
    "Advertising Campaign",
    "Channel Management",
    "Influencer Marketing",
  ],
  "SEO Services": [
    "Local SEO",
    "Technical SEO",
    "Content SEO",
    "SEO Audit",
  ],
  "Video Production": [
    "Explainer Video",
    "Social Media Video",
    "Brand Film",
    "Product Video",
  ],
};

const budgetOptions = [
  "₹25K–₹50K",
  "₹50K–₹1L",
  "₹1L–₹3L",
  "₹3L+",
];

const timelineOptions = [
  "Immediately",
  "Within 1 Month",
  "Within 3 Months",
  "Just Exploring",
];

const consultationOptions = [
  "Book Consultation",
  "Request Proposal",
  "Talk to Expert",
];

const initialMessage = {
  role: "bot",
  text: "👋 Welcome to Adway Creations. What service are you interested in?",
  options: serviceOptions,
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([initialMessage]);
  const [stage, setStage] = useState("service");
  const [selectedService, setSelectedService] = useState("");
  const [selectedProjectType, setSelectedProjectType] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedTimeline, setSelectedTimeline] = useState("");
  const [contact, setContact] = useState({
    name: "",
    business: "",
    email: "",
    phone: "",
    requirements: "",
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const appendUserMessage = (text) => {
    setMessages((prev) => [...prev, { role: "user", text }]);
  };

  const appendBotMessage = (text, options = []) => {
    setMessages((prev) => [...prev, { role: "bot", text, options }]);
  };

  const handleOptionSelect = (option) => {
    appendUserMessage(option);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      if (stage === "service") {
        setSelectedService(option);
        const followUp = projectTypeOptions[option] || ["Small Project", "Medium Project", "Large Project"];
        appendBotMessage(
          `Great choice! What type of ${option.toLowerCase()} do you need?`,
          followUp,
        );
        setStage("projectType");
        return;
      }

      if (stage === "projectType") {
        setSelectedProjectType(option);
        appendBotMessage("What's your approximate budget?", budgetOptions);
        setStage("budget");
        return;
      }

      if (stage === "budget") {
        setSelectedBudget(option);
        appendBotMessage("How soon would you like to start?", timelineOptions);
        setStage("timeline");
        return;
      }

      if (stage === "timeline") {
        setSelectedTimeline(option);
        appendBotMessage(
          "Please enter your name, business name, email, phone number and a brief project summary so our team can contact you.",
        );
        setStage("contact");
        return;
      }

      if (stage === "consultation") {
        appendBotMessage(
          "Thank you for choosing Adway Creations. Our team will reach out shortly with the next steps.",
        );
        setStage("done");
        return;
      }
    }, 500);
  };

  const handleContactChange = (field, value) => {
    setContact((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    if (!contact.name || !contact.phone || !contact.email) {
      return;
    }

    const summary = `Name: ${contact.name}, Business: ${contact.business || "N/A"}, Email: ${contact.email}, Phone: ${contact.phone}, Requirements: ${contact.requirements || "N/A"}`;
    appendUserMessage(summary);
    setContactSubmitted(true);
    setIsTyping(true);

    try {
      const payload = {
        service: selectedService,
        projectType: selectedProjectType,
        budget: selectedBudget,
        timeline: selectedTimeline,
        contact,
      };

      const response = await fetch(`${API}/api/chat-enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Failed to submit inquiry");
      }

      const data = await response.json();
      appendBotMessage(
        "Thanks! Your inquiry has been sent. Would you like a free consultation with our team?",
        consultationOptions,
      );
      setStage("consultation");
    } catch (error) {
      console.error("Chat enquiry submit failed:", error);
      appendBotMessage(
        "Something went wrong while saving your inquiry. Please try again or contact us directly.",
      );
      setContactSubmitted(false);
      setStage("contact");
    } finally {
      setIsTyping(false);
    }
  };

  const showContactForm = stage === "contact" && !contactSubmitted;

  return (
    <>
      <div
        className={`fixed z-[9999] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] bottom-44 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[70vh] sm:max-h-[520px] ${isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-8 scale-95 pointer-events-none"
          }`}
      >
        <div className="flex flex-col bg-white border border-black/10 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden h-[70vh] sm:h-[520px]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-black/10 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-black leading-tight">Adway Assistant</p>
                <p className="text-[11px] text-black/60 font-medium">Guided lead generation</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-black/50 hover:text-black hover:bg-black/5 transition-all"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin bg-white">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${msg.role === "bot" ? "bg-black" : "bg-black/90"
                    }`}
                >
                  {msg.role === "bot" ? (
                    <Bot className="w-3.5 h-3.5 text-white font-medium" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-white font-medium" />
                  )}
                </div>

                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === "bot"
                      ? "bg-black/5 text-black rounded-tl-sm"
                      : "bg-black text-white rounded-tr-sm"
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5">
                <div className="shrink-0 w-7 h-7 rounded-full bg-black flex items-center justify-center mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-black/5 px-4 py-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-black/50 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-black/50 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-black/50 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 py-3 border-t border-black/10 bg-white">
            {showContactForm ? (
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <div className="grid gap-3">
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => handleContactChange("name", e.target.value)}
                    placeholder="Name"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 text-black placeholder:text-black/40 focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    value={contact.business}
                    onChange={(e) => handleContactChange("business", e.target.value)}
                    placeholder="Business Name"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 text-black placeholder:text-black/40 focus:outline-none"
                  />
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => handleContactChange("email", e.target.value)}
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 text-black placeholder:text-black/40 focus:outline-none"
                    required
                  />
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => handleContactChange("phone", e.target.value)}
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 text-black placeholder:text-black/40 focus:outline-none"
                    required
                  />
                  <textarea
                    value={contact.requirements}
                    onChange={(e) => handleContactChange("requirements", e.target.value)}
                    placeholder="Project requirements"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 text-black placeholder:text-black/40 focus:outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-black/90 transition"
                >
                  Submit Contact Details
                </button>
              </form>
            ) : (
              <div className="flex flex-wrap gap-2">
                {messages
                  .filter((msg) => msg.role === "bot" && msg.options)
                  .slice(-1)[0]
                  ?.options?.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect(option)}
                      className="px-3 py-2 border border-black/10 text-black font-medium rounded-full text-xs hover:text-white hover:bg-black transition"
                    >
                      {option}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed z-[30] bottom-20 sm:bottom-10 right-4 sm:right-10">
        {!isOpen && (
          <span className="absolute -top-1 -right-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ">
            3
          </span>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close chat" : "Open chat"}
          className={`relative flex h-[55px] w-[55px] items-center justify-center rounded-full transition-all duration-300 ease-out overflow-visible ${isOpen
              ? "scale-90 border border-white bg-black hover:bg-violet-600"
              : "border border-violet-500/10 bg-violet-600 hover:bg-violet-600/30"
            }`}
        >
          {!isOpen && (
            <>
              <span className="absolute -inset-2 rounded-full animate-spin [animation-duration:5s]">
                <span className="absolute inset-0 rounded-full border border-violet-500/20" />
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.9)]" />
              </span>
              <span className="absolute -inset-2 rounded-full animate-spin [animation-duration:2s]">
                <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-white/80 border-r-white/80" />
              </span>
              <span className="absolute -inset-3 rounded-full animate-spin [animation-duration:8s] [animation-direction:reverse]">
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
              </span>
            </>
          )}
          <span className="relative z-10">
            {isOpen ? (
              <X className="h-[22px] w-[22px] text-white" strokeWidth={2.5} />
            ) : (
              <MessageCircle className="h-[26px] w-[26px] text-white" />
            )}
          </span>
        </button>
      </div>
    </>
  );
}
