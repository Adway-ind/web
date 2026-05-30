import { useState, useCallback, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Tag,
} from 'lucide-react'
import { API } from '../config/api'

const resolveImageUrl = (url) => {
  if (!url) return ''
  if (/^(?:https?:|blob:|data:)/.test(url)) return url
  return `${API}${url}`
}

/* ─── Image Slider ─── */
function ImageSlider({ images, title }) {
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const total = images.length

  const goTo = useCallback(
    (index) => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setCurrent((index + total) % total)
      setTimeout(() => setIsTransitioning(false), 600)
    },
    [isTransitioning, total]
  )

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  if (!images || images.length === 0) return null

  return (
    <div className="relative">
      {/* Main image */}
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-white/5">
        {images.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <img
              src={img}
              alt={`${title} - ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Nav arrows */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Counter */}
        {total > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-full z-10">
            {current + 1} / {total}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {total > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden transition-all duration-300 border-2 ${
                i === current
                  ? 'border-white opacity-100 scale-105'
                  : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Page ─── */
export default function PortfolioDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [prevProject, setPrevProject] = useState(null)
  const [nextProject, setNextProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    setProject(null)
    fetch(`${API}/api/projects/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then(({ project, prevSlug, nextSlug }) => {
        setProject(project)
        setPrevProject(prevSlug || null)
        setNextProject(nextSlug || null)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-2 border-white/10 border-t-white/50 rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Project not found</h1>
          <p className="text-white/50 mb-8">The project you're looking for doesn't exist.</p>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </Link>
        </div>
      </div>
    )
  }

  // Normalise images — API may return a JSON array string or an actual array
  const images = Array.isArray(project.images)
    ? project.images
    : project.image
    ? [project.image]
    : []

  const resolvedImages = images.map(resolveImageUrl)

  // Normalise tags
  const tags = Array.isArray(project.tags)
    ? project.tags
    : typeof project.tags === 'string'
    ? JSON.parse(project.tags)
    : []

  return (
    <>
      {/* Top bar */}
      <div className="bg-black pt-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-8">
          <button
            onClick={() => navigate('/portfolio')}
            className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </button>
        </div>
      </div>

      {/* Hero area with slider */}
      <section className="bg-black pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <ImageSlider images={resolvedImages} title={project.title} />
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-neutral-950">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main content */}
            <div className="lg:col-span-2">
              <span className="text-white/50 text-sm font-semibold uppercase tracking-wider">
                {project.category}
              </span>
              <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                {project.title}
              </h1>
              <p className="mt-6 text-white/60 text-lg leading-relaxed">
                {project.description || project.desc}
              </p>

              {/* Challenge */}
              {project.challenge && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold text-white mb-4">The Challenge</h2>
                  <p className="text-white/60 leading-relaxed">{project.challenge}</p>
                </div>
              )}

              {/* Result */}
              {project.result && (
                <div className="mt-10">
                  <h2 className="text-2xl font-bold text-white mb-4">The Result</h2>
                  <p className="text-white/60 leading-relaxed">{project.result}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-8">
                {/* Info card */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
                    Project Info
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Tag className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs text-white/40 font-medium">Category</div>
                        <div className="text-sm text-white font-medium">{project.category}</div>
                      </div>
                    </div>
                    {project.year && (
                      <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs text-white/40 font-medium">Year</div>
                          <div className="text-sm text-white font-medium">{project.year}</div>
                        </div>
                      </div>
                    )}
                    {project.client && (
                      <div className="flex items-start gap-3">
                        <User className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs text-white/40 font-medium">Client</div>
                          <div className="text-sm text-white font-medium">{project.client}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                      Deliverables
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 bg-white/5 text-white/60 rounded-full text-xs font-medium border border-white/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <Link
                  to="/contact"
                  className="group flex items-center justify-center gap-2 w-full px-6 py-4 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 shadow-lg"
                >
                  Start a Similar Project
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project navigation */}
      {(prevProject || nextProject) && (
        <section className="py-16 bg-black border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {prevProject ? (
                <Link
                  to={`/portfolio/${prevProject.slug}`}
                  className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors"
                >
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white group-hover:text-white transition-all">
                    <ChevronLeft className="w-5 h-5" />
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs text-white/40 font-medium">Previous</div>
                    <div className="text-sm font-semibold">{prevProject.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              <Link
                to="/portfolio"
                className="text-sm text-white/40 hover:text-white font-medium transition-colors"
              >
                View All
              </Link>

              {nextProject ? (
                <Link
                  to={`/portfolio/${nextProject.slug}`}
                  className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors"
                >
                  <div className="hidden sm:block text-right">
                    <div className="text-xs text-white/40 font-medium">Next</div>
                    <div className="text-sm font-semibold">{nextProject.title}</div>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white group-hover:text-white transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
