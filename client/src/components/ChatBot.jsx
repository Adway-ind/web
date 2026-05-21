import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

/* ─── Quick prompts ─── */
const quickPrompts = [
  "What services do you offer?",
  "How much does branding cost?",
  "How long does a project take?",
  "I want to start a project",
];

/* ─── Bot responses ─── */
const botResponses = {
  services:
    "We offer Brand Strategy, Visual Identity, Digital Design, Motion Graphics, Brand Growth, and Brand Guidelines. Each service is tailored to your specific needs. Want to explore any of these in detail?",
  cost: "Our pricing is project-based and depends on scope, timeline, and deliverables. Typical branding projects range from $5K–$50K+. We'd love to learn more about your needs — shall I connect you with our team?",
  timeline:
    "Most branding projects take 6–12 weeks depending on complexity. A visual identity project is typically 6–8 weeks, while a full brand strategy can take 10–12 weeks. Want to discuss your specific timeline?",
  start:
    "Great! The best way to get started is to fill out our contact form or schedule a call. I can redirect you to our contact page right now — just say the word!",
  default:
    "Thanks for your message! For detailed inquiries, our team is best equipped to help. Would you like me to connect you with someone, or is there anything else I can assist with?",
};

function getBotResponse(input) {
  const lower = input.toLowerCase();
  if (
    lower.includes("service") ||
    lower.includes("offer") ||
    lower.includes("what do you")
  )
    return botResponses.services;
  if (
    lower.includes("cost") ||
    lower.includes("price") ||
    lower.includes("pricing") ||
    lower.includes("how much")
  )
    return botResponses.cost;
  if (
    lower.includes("long") ||
    lower.includes("timeline") ||
    lower.includes("take") ||
    lower.includes("duration")
  )
    return botResponses.timeline;
  if (
    lower.includes("start") ||
    lower.includes("begin") ||
    lower.includes("project") ||
    lower.includes("hire")
  )
    return botResponses.start;
  return botResponses.default;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hey there! 👋 I'm Adway's assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  /* Auto-scroll to bottom */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* Focus input when chat opens */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = (text) => {
    const msg = text || input.trim();
    if (!msg) return;

    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setInput("");
    setIsTyping(true);

    /* Simulate typing delay */
    setTimeout(
      () => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: getBotResponse(msg) },
        ]);
      },
      800 + Math.random() * 600,
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ─── Chat Panel ─── */}
      <div
        className={`fixed z-[9999] transition-all duration-300 ease-out
          /* Bottom position — above the FAB on all screens */
          bottom-24 right-4 sm:right-6
          /* Full width on small screens, capped on larger */
          w-[calc(100vw-2rem)] sm:w-[400px]
          max-h-[70vh] sm:max-h-[520px]
          ${
            isOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-4 pointer-events-none"
          }
        `}
      >
        <div className="flex flex-col bg-neutral-950 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden h-[70vh] sm:h-[520px]">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">
                  Adway Assistant
                </p>
                <p className="text-[11px] text-white/40">Always online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${
                    msg.role === "bot" ? "bg-white/10" : "bg-white/20"
                  }`}
                >
                  {msg.role === "bot" ? (
                    <Bot className="w-3.5 h-3.5 text-white/70" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-white/80" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "bot"
                      ? "bg-white/5 text-white/80 rounded-tl-sm"
                      : "bg-white text-black rounded-tr-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2.5">
                <div className="shrink-0 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-white/70" />
                </div>
                <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/60 hover:text-white hover:border-white/25 transition-all duration-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-white/10 bg-black">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 focus:border-white/25 focus:ring-1 focus:ring-white/10 outline-none transition-all bg-white/5 text-white text-sm placeholder:text-white/30 resize-none max-h-24"
                style={{ minHeight: "42px" }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="shrink-0 w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center hover:bg-white/90 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Floating Action Button ─── */}
      <div className="fixed z-[9998] bottom-5 right-4 sm:right-6">
        {/* Notification badge */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ">
            3
          </span>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close chat" : "Open chat"}
          className={`
    relative flex h-[55px] w-[55px] items-center justify-center rounded-full
    transition-all duration-300 ease-out overflow-visible
    ${
      isOpen
        ? "scale-90 border border-white bg-black hover:bg-violet-600"
        : "border border-violet-500/10 bg-violet-600 hover:bg-violet-600/30"
    }
  `}
        >
          {!isOpen && (
            <>
              {/* Pulse Effects */}
              <span className="absolute -inset-2 rounded-full animate-spin [animation-duration:5s]">
                <span className="absolute inset-0 rounded-full border border-violet-500/20" />
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.9)]" />
              </span>

              {/* Rotating Ring */}
              <span className="absolute -inset-2 rounded-full animate-spin [animation-duration:2s]">
<span className="absolute inset-0 rounded-full border-2 border-transparent border-t-white/80 border-r-white/80" />              </span>

             

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
