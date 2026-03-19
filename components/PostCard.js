import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function PostCard({
  id, title, date, excerpt, category, coverImage, readingTime,
  featured = false, variant = 'default',
}) {
  const formattedDate = date
    ? format(parseISO(date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : ''

  // ─── FEATURED ───
  if (featured) {
    return (
      <Link href={`/posts/${id}`} className="group block">
        <article className="relative bg-burgundy text-cream overflow-hidden gold-hover">
          <div className="absolute inset-0 bg-cross-pattern opacity-50" />
          <div className="relative p-10 md:p-14">
            {category && (
              <span className="inline-block font-display text-xs tracking-[0.3em] uppercase text-gold font-semibold mb-4">
                {category}
              </span>
            )}
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cream group-hover:text-gold-light transition-colors duration-300 leading-tight mb-5">
              {title}
            </h2>
            {excerpt && (
              <p className="font-sans text-lg text-cream/80 leading-relaxed mb-6 max-w-2xl">
                {excerpt}
              </p>
            )}
            <div className="flex items-center gap-4">
              <span className="font-sans text-sm text-gold/80">{formattedDate}</span>
              <span className="text-gold/40">{"\u00b7"}</span>
              <span className="font-display text-xs tracking-widest uppercase text-gold font-semibold group-hover:text-gold-light transition-colors">
                {"Ler artigo \u2192"}
              </span>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  // ─── COMPACT: "Populares" grid ───
  if (variant === 'compact') {
    return (
      <Link href={`/posts/${id}`} className="group block h-full">
        <article className="h-full bg-white border border-gray-200 hover:border-burgundy/30 transition-all duration-300 overflow-hidden">
          {coverImage ? (
            <div className="overflow-hidden">
              <img src={coverImage} alt={title}
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ) : (
            <div className="w-full h-44 bg-parchment flex items-center justify-center border-b border-gray-100">
              <span className="font-display text-3xl text-burgundy/15">E</span>
            </div>
          )}
          <div className="p-5">
            {category && (
              <span className="inline-block font-display text-xs tracking-[0.25em] uppercase text-burgundy font-semibold mb-2">
                {category}
              </span>
            )}
            <h3 className="font-serif text-lg font-bold text-burgundy group-hover:text-burgundy-light transition-colors duration-200 leading-snug mb-2 line-clamp-2">
              {title}
            </h3>
            {excerpt && (
              <p className="font-sans text-sm text-ink/70 leading-relaxed line-clamp-2 mb-3">
                {excerpt}
              </p>
            )}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              {readingTime && (
                <span className="font-sans text-xs text-ink/45">{readingTime} min de leitura</span>
              )}
              {!readingTime && (
                <span className="font-sans text-xs text-ink/45">{formattedDate}</span>
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
        <article className="h-full bg-white border border-gray-200 hover:border-burgundy/30 transition-all duration-300 overflow-hidden">
          {coverImage ? (
            <div className="overflow-hidden">
              <img src={coverImage} alt={title}
                className="w-full h-56 md:h-72 object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ) : (
            <div className="w-full h-56 md:h-72 bg-parchment flex items-center justify-center border-b border-gray-100">
              <span className="font-display text-5xl text-burgundy/15">E</span>
            </div>
          )}
          <div className="p-6 md:p-8">
            {category && (
              <span className="inline-block font-display text-xs tracking-[0.25em] uppercase text-burgundy font-semibold mb-3">
                {category}
              </span>
            )}
            <h3 className="font-display text-2xl md:text-3xl font-bold text-burgundy group-hover:text-burgundy-light transition-colors duration-200 leading-tight mb-3">
              {title}
            </h3>
            {excerpt && (
              <p className="font-serif text-base text-ink/70 leading-relaxed line-clamp-3 mb-4">
                {excerpt}
              </p>
            )}
            <div className="flex items-center gap-3">
              <span className="font-sans text-xs text-ink/45">{formattedDate}</span>
              {readingTime && (
                <>
                  <span className="text-ink/20">{"\u00b7"}</span>
                  <span className="font-sans text-xs text-ink/45">{readingTime} min de leitura</span>
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
        <article className="flex gap-5 bg-white border border-gray-200 hover:border-burgundy/30 transition-all duration-300 overflow-hidden">
          {coverImage ? (
            <div className="w-32 md:w-40 flex-shrink-0 overflow-hidden">
              <img src={coverImage} alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ) : (
            <div className="w-32 md:w-40 flex-shrink-0 bg-parchment flex items-center justify-center border-r border-gray-100">
              <span className="font-display text-2xl text-burgundy/15">E</span>
            </div>
          )}
          <div className="flex-1 py-4 pr-5">
            {category && (
              <span className="inline-block font-display text-xs tracking-[0.2em] uppercase text-burgundy font-semibold mb-1">
                {category}
              </span>
            )}
            <h3 className="font-serif text-base font-bold text-burgundy group-hover:text-burgundy-light transition-colors duration-200 leading-snug mb-2 line-clamp-2">
              {title}
            </h3>
            {excerpt && (
              <p className="font-sans text-sm text-ink/60 line-clamp-2 mb-2 hidden md:block">
                {excerpt}
              </p>
            )}
            <div className="flex items-center gap-2">
              {readingTime && (
                <span className="font-sans text-xs text-ink/45">{readingTime} min de leitura</span>
              )}
              {!readingTime && (
                <span className="font-sans text-xs text-ink/45">{formattedDate}</span>
              )}
            </div>
          </div>
        </article>
      </Link>
    )
  }

  // ─── RELATED: equal-height card for "Artigos relacionados" ───
  if (variant === 'related') {
    return (
      <Link href={`/posts/${id}`} className="group block h-full">
        <article className="h-full flex flex-col bg-white border border-gray-200 hover:border-burgundy/30 transition-all duration-300 overflow-hidden">
          {coverImage ? (
            <div className="overflow-hidden h-40">
              <img src={coverImage} alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ) : (
            <div className="h-40 bg-parchment flex items-center justify-center border-b border-gray-100">
              <span className="font-display text-2xl text-burgundy/15">E</span>
            </div>
          )}
          <div className="p-4 flex-1 flex flex-col">
            {category && (
              <span className="inline-block font-display text-xs tracking-[0.2em] uppercase text-burgundy font-semibold mb-2">{category}</span>
            )}
            <h3 className="font-serif text-base font-bold text-ink group-hover:text-burgundy transition-colors duration-200 leading-snug line-clamp-2 mb-2 flex-1">
              {title}
            </h3>
            {excerpt && (
              <p className="font-sans text-xs text-ink/50 line-clamp-2 mb-2">{excerpt}</p>
            )}
            {readingTime && (
              <span className="font-sans text-xs text-ink/35 mt-auto">{readingTime} min de leitura</span>
            )}
          </div>
        </article>
      </Link>
    )
  }

  // ─── DEFAULT ───
  return (
    <Link href={`/posts/${id}`} className="group block h-full">
      <article className="h-full border border-gray-200 hover:border-burgundy/30 transition-all duration-300 bg-cream hover:bg-parchment p-6 gold-hover">
        {category && (
          <span className="inline-block font-display text-xs tracking-[0.25em] uppercase text-burgundy font-semibold mb-3">
            {category}
          </span>
        )}
        <h2 className="font-serif text-xl font-bold text-burgundy group-hover:text-burgundy-light transition-colors duration-200 leading-snug mb-3">
          {title}
        </h2>
        {excerpt && (
          <p className="font-sans text-base text-ink/70 leading-relaxed mb-4 line-clamp-3">
            {excerpt}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <span className="font-sans text-xs text-ink/45">{formattedDate}</span>
          <span className="font-display text-xs tracking-wider uppercase text-burgundy font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {"Ler \u2192"}
          </span>
        </div>
      </article>
    </Link>
  )
}
