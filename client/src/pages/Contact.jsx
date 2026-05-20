import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    detail: "hello@adway.com",
    sub: "We reply within 24 hours",
  },
  {
    icon: Phone,
    title: "Call Us",
    detail: "+1 (555) 123-4567",
    sub: "Mon-Fri, 9am-6pm EST",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    detail: "123 Creative Ave",
    sub: "Design District, NY 10001",
  },
  {
    icon: Clock,
    title: "Working Hours",
    detail: "Mon - Fri",
    sub: "9:00 AM - 6:00 PM EST",
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    budget: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-24 bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-2 bg-accent/10 border border-accent/20 text-accent rounded-full text-sm font-medium mb-6">
            Contact Us
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-bold text-white leading-[1.05] tracking-[-0.02em]">
            Let's start
            <br />
            <span className="gradient-text">something great</span>
          </h1>
          <p className="mt-6 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            Have a project in mind? We'd love to hear about it. Drop us a line
            and let's explore how we can bring your vision to life.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-24 relative z-10">
            {contactInfo.map((info) => (
              <div
                key={info.title}
                className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:border-accent/20 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent transition-colors duration-300">
                  <info.icon className="w-6 h-6 text-accent group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{info.title}</h3>
                <p className="text-gray-900 font-medium">{info.detail}</p>
                <p className="text-gray-400 text-sm">{info.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Tell us about your project
              </h2>
              <p className="mt-3 text-gray-500 text-lg">
                Fill out the form below and we'll get back to you within 24
                hours.
              </p>

              {submitted ? (
                <div className="mt-10 p-8 bg-green-50 border border-green-200 rounded-2xl text-center">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Thank you!
                  </h3>
                  <p className="text-gray-600">
                    We've received your message and will get back to you within
                    24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        company: "",
                        service: "",
                        budget: "",
                        message: "",
                      });
                    }}
                    className="mt-6 px-6 py-3 bg-accent text-white rounded-full font-semibold hover:bg-accent-dark transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-gray-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@company.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your Company"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-gray-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Interested In
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-gray-50 focus:bg-white"
                      >
                        <option value="">Select a service</option>
                        <option value="brand-strategy">Brand Strategy</option>
                        <option value="visual-identity">Visual Identity</option>
                        <option value="digital-design">Digital Design</option>
                        <option value="motion-graphics">Motion Graphics</option>
                        <option value="brand-growth">Brand Growth</option>
                        <option value="brand-guidelines">
                          Brand Guidelines
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Budget
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-gray-50 focus:bg-white"
                    >
                      <option value="">Select a range</option>
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k+">$50,000+</option>
                    </select>
                  </div> */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Details *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project, goals, and timeline..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group w-full sm:w-auto px-8 py-4 bg-accent text-white rounded-xl font-semibold text-lg hover:bg-accent-dark transition-all duration-300 shadow-lg hover:shadow-xl btn-shine flex items-center justify-center gap-2"
                  >
                    Send Message
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>

            {/* Map Placeholder + Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Map */}
              <div className="aspect-square rounded-2xl overflow-hidden relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3932.1048844231896!2d77.1152728!3d9.757182799999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07a9e6a01cace5%3A0x5f4fbbc7a91ae06c!2sAdway%20Creations!5e0!3m2!1sen!2sin!4v1779278790942!5m2!1sen!2sin"
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Adway Creations Location"
                />

                {/* Optional overlay pattern */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-10"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, white 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }}
                />
              </div>

              {/* FAQ */}
              <div className="bg-surface rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Frequently Asked
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      q: "How long does a typical project take?",
                      a: "Most branding projects take 6-12 weeks depending on scope and complexity.",
                    },
                    {
                      q: "What is your pricing structure?",
                      a: "We offer project-based pricing tailored to your specific needs and budget.",
                    },
                    {
                      q: "Do you work with startups?",
                      a: "Absolutely! We love working with ambitious teams at every stage of growth.",
                    },
                  ].map((faq) => (
                    <div key={faq.q}>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {faq.q}
                      </h4>
                      <p className="text-gray-500 text-sm mt-1">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
