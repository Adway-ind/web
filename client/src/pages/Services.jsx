import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Palette,
  Target,
  Zap,
  Layers,
  TrendingUp,
  Sparkles,
  Monitor,
  PenTool,
  Film,
  CheckCircle2,
} from 'lucide-react'

const services = [
  {
    icon: Target,
    title: 'Brand Strategy',
    desc: "We dig deep into your market, audience, and competitive landscape to define a brand positioning that sets you apart. Our strategic frameworks ensure your brand resonates with the right people at the right time.",
    features: ['Market Research & Analysis', 'Brand Positioning', 'Audience Profiling', 'Competitive Audit', 'Brand Architecture'],
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80',
  },
  {
    icon: Palette,
    title: 'Visual Identity',
    desc: "From logos to comprehensive design systems, we create visual identities that are distinctive, memorable, and flexible enough to grow with your brand across every touchpoint.",
    features: ['Logo Design', 'Color Systems', 'Typography Selection', 'Iconography', 'Design Systems'],
    image: 'https://images.unsplash.com/photo-1561070791-252763f67429?w=800&q=80',
  },
  {
    icon: Layers,
    title: 'Digital Design',
    desc: "We design beautiful, intuitive digital experiences — from websites to apps — that connect with your audience and reinforce your brand at every interaction.",
    features: ['Web Design', 'App UI/UX Design', 'Responsive Design', 'Design Prototyping', 'Interactive Experiences'],
    image: 'https://images.unsplash.com/photo-1542744094-3a9f06479bed?w=800&q=80',
  },
  {
    icon: Film,
    title: 'Motion Graphics',
    desc: "Dynamic animations and motion design that bring your brand story to life. From logo animations to social media content, we create movement that captivates.",
    features: ['Logo Animation', 'Social Media Motion', 'Explainer Videos', 'Brand Films', 'Animated Assets'],
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b2527c77?w=800&q=80',
  },
  {
    icon: TrendingUp,
    title: 'Brand Growth',
    desc: "Strategic brand evolution that scales with your business. Whether you're entering new markets or refreshing your presence, we ensure your brand stays relevant and impactful.",
    features: ['Brand Evolution Strategy', 'Market Expansion', 'Rebranding', 'Sub-brand Development', 'Brand Audits'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  },
  {
    icon: Sparkles,
    title: 'Brand Guidelines',
    desc: "Comprehensive brand books and guidelines that empower your team to maintain brand consistency across every channel and touchpoint.",
    features: ['Brand Books', 'Usage Guidelines', 'Template Systems', 'Asset Libraries', 'Training Materials'],
    image: 'https://images.unsplash.com/photo-1558655146-9f407e84e0c1?w=800&q=80',
  },
]

const process = [
  {
    step: '01',
    title: 'Discovery',
    desc: 'Deep research into your brand, market, competitors, and audience to uncover critical insights that will shape the strategy.',
  },
  {
    step: '02',
    title: 'Strategy',
    desc: 'Define your brand positioning, messaging framework, and strategic direction based on research findings.',
  },
  {
    step: '03',
    title: 'Design',
    desc: 'Explore creative concepts and refine them into a cohesive visual identity that brings the strategy to life.',
  },
  {
    step: '04',
    title: 'Refine',
    desc: 'Iterate on designs with your feedback, testing and polishing every detail until perfection is achieved.',
  },
  {
    step: '05',
    title: 'Deliver',
    desc: 'Receive a complete brand package with guidelines, assets, and everything needed to launch with confidence.',
  },
]

export default function Services() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-24 bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-2 bg-accent/10 border border-accent/20 text-accent rounded-full text-sm font-medium mb-6">
            Our Services
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-bold text-white leading-[1.05] tracking-[-0.02e">
            Everything your
            <br />
            <span className="gradient-text">brand needs</span>
          </h1>
          <p className="mt-6 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            From strategy to execution, we provide a complete suite of branding
            services to help you stand out in a crowded marketplace.
          </p>
        </div>
      </section>

      {/* Services Detail */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {services.map((service, i) => (
              <div
                key={service.title}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
                  i % 2 === 1 ? 'lg:direction-rtl' : ''
                }`}
              >
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                    <service.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-medium text-gray-900 tracking-tight">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-gray-500 text-lg leading-relaxed">
                    {service.desc}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">How It Works</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-medium text-gray-900 tracking-tight">
              Our proven process
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              A structured approach that ensures exceptional results every time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {process.map((p, i) => (
              <div key={p.step} className="relative text-center group">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-accent transition-colors duration-300">
                  <span className="text-xl font-bold text-accent group-hover:text-white transition-colors">{p.step}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                {i < process.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Ready to transform your brand?
          </h2>
          <p className="mt-4 text-lg text-white/50">
            Let's discuss which services are right for you.
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 mt-8 px-8 py-4 bg-accent text-white rounded-full font-semibold text-lg hover:bg-accent-dark transition-all duration-300 shadow-lg btn-shine"
          >
            Schedule a Call
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  )
}
