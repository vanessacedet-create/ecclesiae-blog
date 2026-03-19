import Link from 'next/link'

export default function PostSidebar({ settings = {}, recentPosts = [] }) {
  return (
    <aside className="space-y-8">

      {/* Recent posts */}
      {recentPosts.length > 0 && (
        <div>
          <h3 className="font-display text-xs tracking-[0.25em] uppercase text-burgundy font-semibold mb-5">
            Posts Recentes
          </h3>
          <div className="flex flex-col gap-6">
            {recentPosts.map(post => (
              <Link key={post.id} href={`/posts/${post.id}`} className="group block">
                <article>
                  {post.category && (
                    <span className="font-display tracking-[0.15em] uppercase text-burgundy/50 font-semibold mb-1 block" style={{ fontSize: '10px' }}>
                      {post.category}
                    </span>
                  )}
                  <h4 className="font-serif text-sm font-bold text-ink group-hover:text-burgundy transition-colors duration-200 leading-snug mb-1 line-clamp-2">
                    {post.title}
                  </h4>
                  {post.excerpt && (
                    <p className="font-sans text-xs text-ink/50 leading-relaxed line-clamp-2 mb-1">
                      {post.excerpt}
                    </p>
                  )}
                  {post.readingTime && (
                    <span className="font-sans text-xs text-ink/35">
                      {post.readingTime} min de leitura
                    </span>
                  )}
                </article>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Store CTA - with spacing */}
      {settings.storeUrl && (
        <>
          <div className="h-px bg-gray-200 my-2" />
          <a
            href={settings.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center font-display text-xs tracking-[0.15em] uppercase font-semibold text-cream bg-burgundy hover:bg-burgundy-light px-4 py-3 transition-colors duration-200 mt-4"
          >
            {"Visite a Loja \u2197"}
          </a>
        </>
      )}
    </aside>
  )
}
