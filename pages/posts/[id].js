import Layout from '../../components/Layout'
import PostSidebar from '../../components/PostSidebar'
import { getAllPostIds, getPostData, getSortedPostsData } from '../../lib/posts'
import { getCategoriasLocal } from '../../lib/categorias'
import { getSettings } from '../../lib/settings'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'
import { useEffect, useState } from 'react'

function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    function handleScroll() {
      const article = document.querySelector('.post-content')
      if (!article) return
      const rect = article.getBoundingClientRect()
      const articleTop = rect.top + window.scrollY
      const articleHeight = article.offsetHeight
      const windowHeight = window.innerHeight
      const scrolled = window.scrollY - articleTop + windowHeight * 0.3
      const pct = Math.min(Math.max((scrolled / articleHeight) * 100, 0), 100)
      setProgress(pct)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <div className="fixed top-0 left-0 h-[3px] bg-gold z-[200] transition-all duration-150"
      style={{ width: `${progress}%` }} />
  )
}

export default function Post({ postData, categorias, relatedPosts, recentPosts, settings }) {
  const formattedDate = postData.date
    ? format(parseISO(postData.date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : ''
  const categorySlug = postData.category
    ? postData.category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
    : ''
  const postCategories = postData.categories && Array.isArray(postData.categories)
    ? postData.categories
    : postData.category ? [postData.category] : []

  return (
    <Layout title={postData.title} description={postData.excerpt} categorias={categorias} settings={settings}>
      <ReadingProgress />

      {/* Hero: Cover Image */}
      {postData.coverImage && (
        <div className="w-full bg-ink/5">
          <img src={postData.coverImage} alt={postData.title}
            className="w-full max-w-6xl mx-auto h-72 md:h-96 lg:h-[30rem] object-cover" />
        </div>
      )}

      {/* Two-column layout: Article + Sidebar */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* ─── Main article column ─── */}
          <article className="lg:col-span-8">
            <header className={`${postData.coverImage ? 'pt-10' : 'pt-16'} pb-8`}>
              {postCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {postCategories.map(cat => {
                    const slug = cat.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
                    return (
                      <Link key={cat} href={`/categorias/${slug}`}
                        className="inline-block font-display text-xs tracking-[0.25em] uppercase text-burgundy border border-burgundy/30 px-3 py-1 hover:bg-burgundy hover:text-cream transition-all duration-200">
                        {cat}
                      </Link>
                    )
                  })}
                </div>
              )}
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-ink leading-tight mb-5">
                {postData.title}
              </h1>
              {postData.excerpt && (
                <p className="font-serif text-xl md:text-2xl text-ink/55 leading-relaxed mb-6">
                  {postData.excerpt}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3 text-sm text-ink/40 font-sans">
                {postData.author && (
                  <><span className="text-ink/60">{postData.author}</span><span className="text-ink/20">{"\u00b7"}</span></>
                )}
                <span>{formattedDate}</span>
                {postData.readingTime && (
                  <><span className="text-ink/20">{"\u00b7"}</span><span>{postData.readingTime} min de leitura</span></>
                )}
              </div>
            </header>

            <div className="h-px bg-gray-200 mb-10" />

            <div className="post-content prose-ecclesiae"
              dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />

            {/* End ornament */}
            <div className="flex items-center justify-center gap-4 mt-16 mb-10">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
              <span className="text-gold text-lg">{"\u2720"}</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between py-6 border-t border-gray-200 mb-12">
              <Link href="/" className="font-display text-xs tracking-[0.2em] uppercase text-ink/50 hover:text-burgundy transition-colors">
                {"\u2190 Voltar ao blog"}
              </Link>
              {postData.category && (
                <Link href={`/categorias/${categorySlug}`}
                  className="font-display text-xs tracking-[0.2em] uppercase text-ink/50 hover:text-burgundy transition-colors">
                  {"Mais em " + postData.category + " \u2192"}
                </Link>
              )}
            </div>
          </article>

          {/* ─── Sidebar column ─── */}
          <div className="lg:col-span-4">
            <div className={`${postData.coverImage ? 'lg:pt-10' : 'lg:pt-16'} lg:sticky lg:top-24`}>
              <PostSidebar settings={settings} recentPosts={recentPosts} />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Related Posts (full width, below article) ─── */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gray-200" />
            <h2 className="font-display text-xs tracking-[0.3em] uppercase text-gold flex-shrink-0">
              Artigos relacionados
            </h2>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(post => (
              <Link key={post.id} href={`/posts/${post.id}`} className="group block">
                <article className="border border-gray-200 hover:border-gold/50 transition-all duration-300 overflow-hidden bg-white">
                  {post.coverImage ? (
                    <div className="overflow-hidden">
                      <img src={post.coverImage} alt={post.title}
                        className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="w-full h-36 bg-parchment flex items-center justify-center border-b border-gray-100">
                      <span className="font-display text-2xl text-gold/20">{"\u2720"}</span>
                    </div>
                  )}
                  <div className="p-4">
                    {post.category && (
                      <span className="inline-block font-display text-xs tracking-[0.2em] uppercase text-gold mb-2">{post.category}</span>
                    )}
                    <h3 className="font-serif text-base font-bold text-ink group-hover:text-burgundy transition-colors duration-200 leading-snug line-clamp-2 mb-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="font-sans text-xs text-ink/40 line-clamp-2 mb-2">{post.excerpt}</p>
                    )}
                    {post.readingTime && (
                      <span className="font-sans text-xs text-ink/30">{post.readingTime} min de leitura</span>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = getAllPostIds()
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id)
  const categorias = getCategoriasLocal()
  const allPosts = getSortedPostsData()
  const settings = await getSettings()

  // Related posts: same category, excluding current, always 3
  const relatedPosts = allPosts
    .filter(p => p.id !== params.id && p.category === postData.category)
    .slice(0, 3)
  if (relatedPosts.length < 3) {
    const remaining = allPosts
      .filter(p => p.id !== params.id && !relatedPosts.find(r => r.id === p.id))
      .slice(0, 3 - relatedPosts.length)
    relatedPosts.push(...remaining)
  }

  // Recent posts for sidebar: latest 3, excluding current
  const recentPosts = allPosts
    .filter(p => p.id !== params.id)
    .slice(0, 3)

  return { props: { postData, categorias, relatedPosts, recentPosts, settings } }
}
