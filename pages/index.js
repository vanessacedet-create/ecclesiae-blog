import Layout from '../components/Layout'
import PostCard from '../components/PostCard'
import { getSortedPostsData } from '../lib/posts'
import { getCategoriasLocal } from '../lib/categorias'
import { getSettings } from '../lib/settings'
import Link from 'next/link'

export default function Home({ allPostsData, categorias, settings }) {
  const featuredPost = allPostsData[0]
  const popularPosts = allPostsData.slice(1, 5)
  const postsByCategory = {}
  categorias.forEach(cat => {
    const catPosts = allPostsData.filter(
      p => p.category && p.category.toLowerCase() === cat.label.toLowerCase()
    )
    if (catPosts.length > 0) {
      postsByCategory[cat.slug] = { label: cat.label, slug: cat.slug, posts: catPosts.slice(0, 4) }
    }
  })
  const storeUrl = settings?.storeUrl || 'https://www.editoraecclesiae.com.br'

  // Fill popular posts grid: if less than 4, show what we have in responsive grid
  const popularGridCols = popularPosts.length >= 4
    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    : popularPosts.length === 3
    ? 'grid-cols-1 md:grid-cols-3'
    : popularPosts.length === 2
    ? 'grid-cols-1 md:grid-cols-2'
    : 'grid-cols-1'

  return (
    <Layout categorias={categorias} settings={settings}>

      {/* HERO */}
      {featuredPost && (
        <section className="relative bg-burgundy overflow-hidden">
          <div className="absolute inset-0 bg-cross-pattern opacity-30" />
          <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="order-2 lg:order-1">
                {featuredPost.category && (
                  <span className="inline-block font-display text-xs tracking-[0.3em] uppercase text-gold font-semibold mb-4 border border-gold/30 px-3 py-1">
                    {featuredPost.category}
                  </span>
                )}
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-cream leading-tight mb-5">
                  <Link href={`/posts/${featuredPost.id}`} className="hover:text-gold-light transition-colors duration-300">
                    {featuredPost.title}
                  </Link>
                </h2>
                {featuredPost.excerpt && (
                  <p className="font-serif text-lg text-cream/75 leading-relaxed mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-4">
                  {featuredPost.readingTime && (
                    <span className="font-sans text-sm text-cream/50">{featuredPost.readingTime} min de leitura</span>
                  )}
                  <Link href={`/posts/${featuredPost.id}`}
                    className="inline-flex items-center gap-2 font-display text-xs tracking-[0.2em] uppercase text-gold font-semibold hover:text-gold-light transition-colors duration-200">
                    {"Ler artigo \u2192"}
                  </Link>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                {featuredPost.coverImage ? (
                  <Link href={`/posts/${featuredPost.id}`} className="block overflow-hidden">
                    <img src={featuredPost.coverImage} alt={featuredPost.title}
                      className="w-full h-64 md:h-80 lg:h-96 object-cover hover:scale-105 transition-transform duration-500" />
                  </Link>
                ) : (
                  <div className="w-full h-64 md:h-80 lg:h-96 bg-burgundy-light/30 border border-gold/20 flex items-center justify-center">
                    <span className="font-display text-6xl text-gold/20">E</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* POPULAR */}
      {popularPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-gold/40" />
              <h2 className="font-display text-xs tracking-[0.3em] uppercase text-burgundy font-semibold">Populares</h2>
              <div className="h-px w-12 bg-gold/40" />
            </div>
          </div>
          <div className={`grid ${popularGridCols} gap-6`}>
            {popularPosts.map(post => (
              <PostCard key={post.id} id={post.id} title={post.title} date={post.date}
                excerpt={post.excerpt} category={post.category} coverImage={post.coverImage}
                readingTime={post.readingTime} variant="compact" />
            ))}
          </div>
        </section>
      )}

      {/* SECTIONS BY CATEGORY */}
      {Object.keys(postsByCategory).map(slug => {
        const section = postsByCategory[slug]
        return (
          <section key={slug} className="border-t border-gray-200">
            <div className="max-w-6xl mx-auto px-6 py-14">
              <div className="flex items-center justify-between mb-10">
                <h2 className="font-display text-2xl font-bold text-burgundy">
                  <Link href={`/categorias/${slug}`} className="hover:text-burgundy-light transition-colors duration-200">{section.label}</Link>
                </h2>
                <Link href={`/categorias/${slug}`}
                  className="font-display text-xs tracking-[0.2em] uppercase text-burgundy font-semibold hover:text-burgundy-light transition-colors duration-200">
                  {"Ver todos \u2192"}
                </Link>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {section.posts[0] && (
                  <div className="lg:col-span-7">
                    <PostCard id={section.posts[0].id} title={section.posts[0].title} date={section.posts[0].date}
                      excerpt={section.posts[0].excerpt} category={section.posts[0].category}
                      coverImage={section.posts[0].coverImage} readingTime={section.posts[0].readingTime} variant="large" />
                  </div>
                )}
                {section.posts.length > 1 && (
                  <div className="lg:col-span-5 flex flex-col gap-6">
                    {section.posts.slice(1, 4).map(post => (
                      <PostCard key={post.id} id={post.id} title={post.title} date={post.date}
                        excerpt={post.excerpt} category={post.category} coverImage={post.coverImage}
                        readingTime={post.readingTime} variant="horizontal" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )
      })}

      {/* EMPTY STATE */}
      {allPostsData.length === 0 && (
        <div className="max-w-5xl mx-auto px-6 py-32 text-center">
          <span className="font-display text-6xl text-burgundy/20">E</span>
          <p className="font-serif text-2xl text-burgundy mt-6 mb-3">Em breve, novos artigos</p>
          <p className="font-sans text-ink/50">O blog est\u00e1 sendo preparado com muito cuidado.</p>
        </div>
      )}

      {/* CTA - more spacing from content above */}
      <section className="bg-burgundy border-t border-gold/20 mt-8">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <blockquote className="font-serif text-2xl text-cream/90 mt-2 mb-3 leading-relaxed">
                {'"Senhor, para quem iremos? Tu tens palavras de vida eterna."'}
              </blockquote>
              <cite className="font-display text-xs tracking-[0.3em] uppercase text-gold font-semibold">{"Jo\u00e3o 6, 68"}</cite>
            </div>
            <div className="text-center md:text-right">
              <p className="font-serif text-lg text-cream/70 mb-8">
                {"Conhe\u00e7a os livros da Editora Ecclesiae e aprofunde sua f\u00e9."}
              </p>
              <a href={storeUrl} target="_blank" rel="noopener noreferrer"
                className="inline-block font-display text-xs tracking-[0.2em] uppercase font-semibold text-burgundy-dark bg-gold hover:bg-gold-light px-8 py-4 transition-colors duration-200">
                {"Visite a Loja \u2197"}
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  const categorias = getCategoriasLocal()
  const settings = await getSettings()
  return { props: { allPostsData, categorias, settings } }
}
