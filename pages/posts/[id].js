import Layout from '../../components/Layout'
import PostSidebar from '../../components/PostSidebar'
import PostCard from '../../components/PostCard'
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

      {/* Two-column layout */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main article */}
          <article className="lg:col-span-8">
            <header className={`${postData.coverImage ? 'pt-10' : 'pt-16'} pb-8`}>
              {postCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {postCategories.map(cat => {
                    const slug = cat.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
                    return (
                      <Link key={cat} href={`/categorias/${slug}`}
                        className="inline-block font-display text-xs tracking-[0.25em] uppercase text-burgundy font-semibold border border-burgundy/30 px-3 py-1 hover:bg-burgundy hover:text-cream transition-all duration-200">
                        {cat}
                      </Link>
                    )
                  })}
                </div>
              )}
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-burgundy leading-tight mb-5">
                {postData.title}
              </h1>
              {postData.excerpt && (
                <p className="font-serif text-xl md:text-2xl text-ink/60 leading-relaxed mb-6">
                  {postData.excerpt}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3 text-sm text-ink/45 font-sans">
                {postData.author && (
                  <><span className="text-ink/65">{postData.author}</span><span className="text-ink/20">{"\u00b7"}</span></>
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

            {/* Navigation */}
            <div className="flex items-center justify-between pt-16 pb-6">
              <Link href="/" className="font-display text-xs tracking-[0.2em] uppercase font-semibold text-ink/50 hover:text-burgundy transition-colors">
                {"\u2190 Voltar ao blog"}
              </Link>
              {postData.category && (
                <Link href={`/categorias/${categorySlug}`}
                  className="font-display text-xs tracking-[0.2em] uppercase font-semibold text-ink/50 hover:text-burgundy transition-colors">
                  {"Mais em " + postData.category + " \u2192"}
                </Link>
              )}
            </div>
          </article>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="lg:pt-10 lg:sticky lg:top-20">
              <PostSidebar settings={settings} recentPosts={recentPosts} />
            </div>
          </div>
        </div>

        {/* Single full-width divider across both columns */}
        <div className="h-px bg-gray-200" />
      </div>

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pt-8 pb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gray-200" />
            <h2 className="font-display text-xs tracking-[0.3em] uppercase text-burgundy font-semibold flex-shrink-0">
              Artigos relacionados
            </h2>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(post => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                date={post.date}
                excerpt={post.excerpt}
                category={post.category}
                coverImage={post.coverImage}
                readingTime={post.readingTime}
                variant="related"
              />
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

  const relatedPosts = allPosts
    .filter(p => p.id !== params.id && p.category === postData.category)
    .slice(0, 3)
  if (relatedPosts.length < 3) {
    const remaining = allPosts
      .filter(p => p.id !== params.id && !relatedPosts.find(r => r.id === p.id))
      .slice(0, 3 - relatedPosts.length)
    relatedPosts.push(...remaining)
  }

  const recentPosts = allPosts
    .filter(p => p.id !== params.id)
    .slice(0, 3)

  return { props: { postData, categorias, relatedPosts, recentPosts, settings } }
}
