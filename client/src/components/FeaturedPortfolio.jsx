function PortfolioCard({ item }) {
  return (
    <div className="group relative">
      <Link
        to={`/portfolio/${item.slug || item.id}`}
        className="relative block overflow-hidden h-[420px] lg:h-[540px] border border-white/10 bg-black"
      >
        {item.image ? (
          <img
            src={resolveImageUrl(item.image)}
            alt={item.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-white/[0.03]">
            <ImageIcon className="w-12 h-12 text-white/30" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

        <div className="absolute top-6 left-6 z-20">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 backdrop-blur-md px-5 py-2 text-xs uppercase tracking-[0.2em] text-white/90">
            Featured
          </span>
        </div>

        <div className="absolute top-6 right-6 z-20 h-12 w-12 rounded-full border border-white/10 bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <ArrowRight className="w-5 h-5 text-white -rotate-45" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 p-8">
          <span className="text-sm uppercase tracking-[0.25em] text-white/50">
            {item.category}
          </span>

          <h3 className="mt-2 text-3xl font-bold text-white leading-tight">
            {item.title}
          </h3>

          {item.client && (
            <p className="mt-2 text-base text-white/60">{item.client}</p>
          )}

          {item.description && (
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/50 opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
              {item.description}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}