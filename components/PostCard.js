import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function PostCard({ id, title, date, excerpt, category, featured = false }) {
  const formattedDate = date
    ? format(parseISO(date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : ''

  if (featured) {
    return (
      <Link href={`/posts/${id}`} className="group block">
        <article className="relative bg-burgundy text-cream overflow-hidden gold-hover">
          {/* Background pattern */}
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
              <span className="text-gold/40">·</span>
              <span className="font-display text-xs tracking-widest uppercase text-gold group-hover:text-gold-light transition-colors">
                Ler artigo →
              </span>
            </div>
          </div>
        </article>
      </Link>
    )
  }

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
            Ler →
          </span>
        </div>
      </article>
    </Link>
  )
}
