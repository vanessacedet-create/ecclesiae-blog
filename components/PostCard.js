import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function PostCard({
  id,
  title,
  date,
  excerpt,
  category,
  coverImage,
  readingTime,
  featured = false,
  variant = 'default',
}) {
  const formattedDate = date
    ? format(parseISO(date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : ''

  // ─── FEATURED (hero style, kept for backwards compat) ───
  if (featured) {
    return (
      <Link href={`/posts/${id}`} className="group block">
        <article className="relative bg-burgundy text-cream overflow-hidden gold-hover">
          <div className="absolute inset-0 bg-cross-pattern opacity-50" />
          <div className="relative p-10 md:p-14">
            {category && (
              <span className="inline-block font-display text-xs tracking-[0.3em] uppercase text-gold mb-4">
                {category}
              </span>
            )}
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cream group-hover:text-gold-light transition-colors duration-300 leading-tight mb-5">
              {title}
            </h2>
            {excerpt && (
              <p className="font-sans text-lg text-cream/75 leading-relaxed mb-6 max-w-2xl italic">
                {excerpt}
              </p>
            )}
            <div className="flex items-center gap-4">
              <span className="font-sans text-sm text-gold/80">{formattedDate}</span>
              <span className="text-gold/40">{"\u00b7"}</span>
              <span className="font-display text-xs tracking-widest uppercase text-gold group-hover:text-gold-light transition-colors">
                {"Ler artigo \u2192"}
              </span>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  // ─── COMPACT: small card for "Populares" grid ───
  if (variant === 'compact') {
    return (
      <Link href={`/posts/${id}`} className="group block h-full">
        <article className="h-full bg-white border border-gold/15 hover:border-gold/40 transition-all duration-300 overflow-hidden">
          {coverImage ? (
            <div className="overflow-hidden">
              <img
                src={coverImage}
                alt={title}
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ) : (
            <div className="w-full h-44 bg-parchment flex items-center justify-center border-b border-gold/10">
              <span className="font-display text-3xl text-gold/20">{"\u2720"}</span>
            </div>
          )}
          <div className="p-5">
            {category && (
              <span className="inline-block font-display text-xs tracking-[0.25em] uppercase text-gold mb-2">
                {category}
              </span>
            )}
            <h3 className="font-serif text-lg font-bold text-burgundy group-hover:text-gold transition-colors duration-200 leading-snug mb-2 line-clamp-2">
              {title}
            </h3>
            {excerpt && (
              <p className="font-sans text-sm text-ink/55 leading-relaxed italic line-clamp-2 mb-3">
                {excerpt}
              </p>
            )}
            <div className="flex items-center gap-3 pt-2 border-t border-gold/10">
              {readingTime && (
                <span className="font-sans text-xs text-ink/40">
                  {readingTime} min de leitura
                </span>
              )}
              {!readingTime && (
                <span className="font-sans text-xs text-ink/40">{formattedDate}</span>
              )}
            </div>
          </div>
        </article>
      </Link>
    )
  }

  // ─── LARGE: main post in category section ───
  if (variant === 'large') {
    return (
      <Link href={`/posts/${id}`} className="group block h-full">
        <article className="h-full bg-white border border-gold/15 hover:border-gold/40 transition-all duration-300 overflow-hidden">
          {coverImage ? (
            <div className="overflow-hidden">
              <img
                src={coverImage}
                alt={title}
                className="w-full h-56 md:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ) : (
            <div className="w-full h-56 md:h-72 bg-parchment flex items-center justify-center border-b border-gold/10">
              <span className="font-display text-5xl text-gold/20">{"\u2720"}</span>
            </div>
          )}
          <div className="p-6 md:p-8">
            {category && (
              <span className="inline-block font-display text-xs tracking-[0.25em] uppercase text-gold mb-3">
                {category}
              </span>
            )}
            <h3 className="font-display text-2xl md:text-3xl font-bold text-burgundy group-hover:text-gold transition-colors duration-200 leading-tight mb-3">
              {title}
            </h3>
            {excerpt && (
              <p className="font-serif text-base text-ink/60 leading-relaxed italic line-clamp-3 mb-4">
                {excerpt}
              </p>
            )}
            <div className="flex items-center gap-3">
              <span className="font-sans text-xs text-ink/40">{formattedDate}</span>
              {readingTime && (
                <>
                  <span className="text-gold/30">{"\u00b7"}</span>
                  <span className="font-sans text-xs text-ink/40">
                    {readingTime} min de leitura
                  </span>
                </>
              )}
            </div>
          </div>
        </article>
      </Link>
    )
  }

  // ─── HORIZONTAL: side posts in category section ───
  if (variant === 'horizontal') {
    return (
      <Link href={`/posts/${id}`} className="group block">
        <article className="flex gap-5 bg-white border border-gold/15 hover:border-gold/40 transition-all duration-300 overflow-hidden">
          {coverImage ? (
            <div className="w-32 md:w-40 flex-shrink-0 overflow-hidden">
              <img
                src={coverImage}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ) : (
            <div className="w-32 md:w-40 flex-shrink-0 bg-parchment flex items-center justify-center border-r border-gold/10">
              <span className="font-display text-2xl text-gold/20">{"\u2720"}</span>
            </div>
          )}
          <div className="flex-1 py-4 pr-5">
            {category && (
              <span className="inline-block font-display text-xs tracking-[0.2em] uppercase text-gold mb-1">
                {category}
              </span>
            )}
            <h3 className="font-serif text-base font-bold text-burgundy group-hover:text-gold transition-colors duration-200 leading-snug mb-2 line-clamp-2">
              {title}
            </h3>
            {excerpt && (
              <p className="font-sans text-sm text-ink/50 italic line-clamp-2 mb-2 hidden md:block">
                {excerpt}
              </p>
            )}
            <div className="flex items-center gap-2">
              {readingTime && (
                <span className="font-sans text-xs text-ink/40">
                  {readingTime} min de leitura
                </span>
              )}
              {!readingTime && (
                <span className="font-sans text-xs text-ink/40">{formattedDate}</span>
              )}
            </div>
          </div>
        </article>
      </Link>
    )
  }

  // ─── DEFAULT: original card style ───
  return (
    <Link href={`/posts/${id}`} className="group block h-full">
      <article className="h-full border border-gold/20 hover:border-gold/60 transition-all duration-300 bg-cream hover:bg-parchment p-6 gold-hover">
        {category && (
          <span className="inline-block font-display text-xs tracking-[0.25em] uppercase text-gold mb-3">
            {category}
          </span>
        )}
        <h2 className="font-serif text-xl font-bold text-burgundy group-hover:text-burgundy-light transition-colors duration-200 leading-snug mb-3">
          {title}
        </h2>
        {excerpt && (
          <p className="font-sans text-base text-ink/65 leading-relaxed mb-4 italic line-clamp-3">
            {excerpt}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gold/15">
          <span className="font-sans text-xs text-ink/50">{formattedDate}</span>
          <span className="font-display text-xs tracking-wider uppercase text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {"Ler \u2192"}
          </span>
        </div>
      </article>
    </Link>
  )
}
