import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.18),transparent_18%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.1),transparent_18%)]" />
      <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/5 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] uppercase tracking-[0.35em] text-white/60">
          404 Error
        </span>
        <h1 className="mt-6 text-7xl font-black tracking-tight text-white sm:text-9xl">
          404
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Go Back
          </button>
        </div>
      </div>
    </section>
  );
}
