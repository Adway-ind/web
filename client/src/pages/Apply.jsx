import { useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  Send,
} from "lucide-react";
import { API } from "../config/api";
import SEO from "../components/SEO";

/* ─── Available positions ─── */
const positions = [
  "Senior Brand Designer",
  "Digital Product Designer",
  "Motion Designer",
  "Brand Strategist",
  "Operations Manager",
  "Content Writer",
  "Marketing Analyst",
  "Open Application",
];

export default function Apply() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const prefillRole = searchParams.get("role") || slug || "";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: prefillRole,
    experience: "",
    portfolio: "",
    linkedin: "",
    startDate: "",
    message: "",
    resume: null,
  });

  const SectionHeader = ({ num, title }) => (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-6 h-6 rounded-full border border-[#b49b6e]/35 flex items-center justify-center text-[10px] text-[#ffffff] font-medium shrink-0">
        {num}
      </div>
      <span
        className="text-[#ffffff] text-[15px] tracking-wide"
        style={{ fontFamily: "'Poppins', serif" }}
      >
        {title}
      </span>
      <div className="flex-1 h-px bg-[#b49b6e]/10" />
    </div>
  );

  const Label = ({ children, required }) => (
    <label className="text-[10px] font-medium tracking-[0.08em] uppercase text-white/40">
      {children}
      {required && <span className="text-[#c43636] ml-0.5">*</span>}
    </label>
  );

  const selectArrow = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(180,155,110,0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`;

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-white/[0.07] bg-white/[0.03] text-[#e8e4dc] text-sm placeholder:text-white/20 outline-none transition-all duration-200 focus:border-[#b49b6e]/40 focus:bg-white/[0.05] font-light";

  const selectClass =
    "w-full px-4 py-3 rounded-lg border border-white/[0.07] bg-white/[0.03] text-[#e8e4dc] text-sm outline-none transition-all duration-200 focus:border-[#b49b6e]/40 focus:bg-white/[0.05] appearance-none cursor-pointer pr-10";

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [responseDebug, setResponseDebug] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const name = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      if (!name) throw new Error("First name and last name are required.");

      const payload = new FormData();
      payload.append("name", name);
      payload.append("email", formData.email);
      payload.append("position", formData.position);
      payload.append("phone", formData.phone || "");
      payload.append("portfolio", formData.portfolio || "");
      payload.append("linkedin", formData.linkedin || "");
      payload.append("coverNote", formData.message || "");
      payload.append("experience", formData.experience || "");
      payload.append("startDate", formData.startDate || "");
      if (formData.resume) payload.append("resume", formData.resume);

      const response = await fetch(`${API}/api/applications`, {
        method: "POST",
        body: payload,
      });

      const body = await response.json().catch(() => ({}));
      console.log("Application API response:", body);
      setResponseDebug(body);

      if (!response.ok) {
        throw new Error(body.error || "Failed to submit application");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-6">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Application submitted!
          </h1>
          <p className="text-white/60 text-lg leading-relaxed mb-2">
            Thank you for your interest in joining Adway. We've received your
            application and will review it carefully.
          </p>
          <p className="text-white/40 mb-10">
            You'll hear back from us within 5–7 business days.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/career"
              className="px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition-all duration-300"
            >
              Back to Careers
            </Link>
            <Link
              to="/"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Apply for a Position at Adway | Branding Agency Careers"
        description="Apply for career opportunities at Adway. Join our team of creative professionals in branding, design, and digital marketing."
        keywords="apply adway, job application, creative jobs, branding careers"
        url="/apply"
      />
      {/* Hero / Header */}
      <section className="relative pt-28 pb-16 bg-black overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-500/3 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center  px-6 lg:px-8">
          <Link
            to="/career"
            className="self-start inline-flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium transition-colors duration-300 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Careers
          </Link>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
            Apply to <span className="gradient-text">join us</span>
          </h1>
          <p className="mt-4 text-lg text-white/50 max-w-2xl text-left md:text-center leading-relaxed">
            Ready to shape the future of branding? Fill out the form below and
            we'll be in touch.
          </p>

          {/* Position info pills */}
          {prefillRole && (
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white/70">
                <Briefcase className="w-4 h-4" />
                {prefillRole}
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white/70">
                <MapPin className="w-4 h-4" />
                Remote / Hybrid
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white/70">
                <Clock className="w-4 h-4" />
                Full-time
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-neutral-950">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* 01 Personal Information */}
            <section>
              <SectionHeader num="01" title="Personal information" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label required>First name</Label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label required>Last name</Label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label required>Email address</Label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Phone number</Label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {/* 02 Position Details */}
            <section>
              <SectionHeader num="02" title="Position details" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label required>Position applied for</Label>
                  <div className="relative">
                    <select
                      name="position"
                      required
                      value={formData.position}
                      onChange={handleChange}
                      className={selectClass}
                      style={{
                        backgroundImage: selectArrow,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 14px center",
                      }}
                    >
                      <option value="" className="bg-[#141411]">
                        Select a position
                      </option>
                      {positions.map((pos) => (
                        <option key={pos} value={pos} className="bg-[#141411]">
                          {pos}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Years of experience</Label>
                  <div className="relative">
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className={selectClass}
                      style={{
                        backgroundImage: selectArrow,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 14px center",
                      }}
                    >
                      <option value="" className="bg-[#141411]">
                        Select range
                      </option>
                      {[
                        "0–1 years",
                        "1–3 years",
                        "3–5 years",
                        "5–10 years",
                        "10+ years",
                      ].map((r) => (
                        <option key={r} value={r} className="bg-[#141411]">
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Earliest start date</Label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={inputClass}
                    style={{ colorScheme: "dark" }}
                  />
                </div>
              </div>
            </section>

            {/* 03 Online Presence */}
            <section>
              <SectionHeader num="03" title="Online presence" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label required>Portfolio URL</Label>
                  <input
                    type="url"
                    name="portfolio"
                    required
                    value={formData.portfolio}
                    onChange={handleChange}
                    placeholder="https://yourportfolio.com"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>LinkedIn profile</Label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/you"
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {/* 04 Resume */}
            <section>
              <SectionHeader num="04" title="Resume" />
              <div className="relative border border-dashed border-[#b49b6e]/20 hover:border-[#b49b6e]/40 rounded-xl p-8 text-center transition-colors duration-200 bg-[#b49b6e]/[0.02] cursor-pointer group">
                <input
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-9 h-9 mx-auto mb-3 border border-[#b49b6e]/30 rounded-lg flex items-center justify-center group-hover:border-[#b49b6e]/50 transition-colors">
                  <svg
                    className="w-4 h-4 stroke-[#b49b6e]"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M12 3v12M7 8l5-5 5 5" />
                  </svg>
                </div>
                <p className="text-sm text-white/50 font-light">
                  {formData.resume
                    ? formData.resume.name
                    : "Drop your resume here, or click to browse"}
                </p>
                <p className="text-[11px] text-white/25 mt-1.5 tracking-wide">
                  PDF, DOC, or DOCX — max 10 MB
                </p>
              </div>
            </section>

            {/* 05 Cover Note */}
            <section>
              <SectionHeader num="05" title="Cover note" />
              <div className="flex flex-col gap-1.5">
                <Label>Why Adway? What makes you a great fit?</Label>
                <textarea
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about yourself, your passion for branding, and what you'd bring to the team…"
                  className={`${inputClass} resize-none leading-relaxed`}
                />
              </div>
            </section>

            {/* Footer */}
            <div className="pt-6 border-t border-[#b49b6e]/10 flex flex-col sm:flex-row sm:items-end gap-6">
              <p className="text-[11px] text-white/25 leading-relaxed flex-1">
                By submitting, you consent to Adway storing your information for
                recruitment purposes. We never share your data with third
                parties.
              </p>
              <div className="flex flex-col gap-2">
                {error && <p className="text-sm text-red-400">{error}</p>}
                {responseDebug && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/70">
                    <div className="font-medium text-white mb-1">Debug response</div>
                    <pre className="whitespace-pre-wrap break-words">{JSON.stringify(responseDebug, null, 2)}</pre>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-accent hover:bg-accent/90 text-white text-sm font-medium rounded-lg transition-all duration-200 active:scale-[0.98] shrink-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "Submit application"}
                  <svg
                    className="w-4 h-4 stroke-white transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
