import Link from 'next/link'

const SOCIAL_ICONS = {
  instagram: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  facebook: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  youtube: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  ),
  twitter: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l11.733 16h4.267l-11.733-16zM4 20l6.768-6.768M13.232 10.768L20 4" />
    </svg>
  ),
  tiktok: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  ),
}

const SOCIAL_LABELS = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'YouTube',
  twitter: 'X',
  tiktok: 'TikTok',
}

export default function PostSidebar({ settings = {}, recentPosts = [] }) {
  const socials = ['instagram', 'facebook', 'youtube', 'twitter', 'tiktok']
    .filter(key => settings[key])

  return (
    <aside className="space-y-8">

      {/* Social links */}
      {socials.length > 0 && (
        <div>
          <h3 className="font-display text-xs tracking-[0.25em] uppercase text-gold mb-4">
            Siga a Ecclesiae
          </h3>
          <div className="flex flex-col gap-2">
            {socials.map(key => (
              <a
                key={key}
                href={settings[key]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 py-2 px-3 text-ink/50 hover:text-burgundy hover:bg-burgundy/5 transition-all duration-200 rounded"
              >
                <span className="flex-shrink-0">{SOCIAL_ICONS[key]}</span>
                <span className="font-display text-xs tracking-[0.1em] uppercase">
                  {SOCIAL_LABELS[key]}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      {socials.length > 0 && recentPosts.length > 0 && (
        <div className="h-px bg-gray-200" />
      )}

      {/* Recent posts */}
      {recentPosts.length > 0 && (
        <div>
          <h3 className="font-display text-xs tracking-[0.25em] uppercase text-gold mb-4">
            Posts Recentes
          </h3>
          <div className="flex flex-col gap-5">
            {recentPosts.map(post => (
              <Link key={post.id} href={`/posts/${post.id}`} className="group block">
                <article>
                  {post.category && (
                    <span className="font-display text-xs tracking-[0.15em] uppercase text-gold/70 mb-1 block" style={{ fontSize: '10px' }}>
                      {post.category}
                    </span>
                  )}
                  <h4 className="font-serif text-sm font-bold text-ink group-hover:text-burgundy transition-colors duration-200 leading-snug mb-1 line-clamp-2">
                    {post.title}
                  </h4>
                  {post.excerpt && (
                    <p className="font-sans text-xs text-ink/40 leading-relaxed line-clamp-2 mb-1">
                      {post.excerpt}
                    </p>
                  )}
                  {post.readingTime && (
                    <span className="font-sans text-xs text-ink/30">
                      {post.readingTime} min de leitura
                    </span>
                  )}
                </article>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Store CTA */}
      {settings.storeUrl && (
        <>
          <div className="h-px bg-gray-200" />
          <a
            href={settings.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center font-display text-xs tracking-[0.15em] uppercase text-cream bg-burgundy hover:bg-burgundy-light px-4 py-3 transition-colors duration-200"
          >
            {"Visite a Loja \u2197"}
          </a>
        </>
      )}
    </aside>
  )
}
