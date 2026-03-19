import Layout from '../../components/Layout'
import PostCard from '../../components/PostCard'
import { getSortedPostsData } from '../../lib/posts'
import { getCategoriasLocal } from '../../lib/categorias'
import { getSettings } from '../../lib/settings'
import Link from 'next/link'

export default function Categorias({ categorias, postsByCategory, settings }) {
  return (
    <Layout title="Categorias" categorias={categorias} settings={settings}>
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-20">

        <div className="mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-burgundy mb-3">
            Categorias
          </h1>
          <p className="font-serif text-lg text-ink/50">
            Explore os artigos por tema.
          </p>
        </div>

        {categorias.map(cat => {
          const posts = postsByCategory[cat.slug] || []
          return (
            <section key={cat.slug} className="mb-14">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-burgundy">
                  <Link href={`/categorias/${cat.slug}`} className="hover:text-burgundy-light transition-colors">
                    {cat.label}
                  </Link>
                </h2>
                <span className="font-sans text-sm text-ink/40">
                  {posts.length} {posts.length === 1 ? 'artigo' : 'artigos'}
                </span>
              </div>

              {posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {posts.slice(0, 3).map(post => (
                    <PostCard
                      key={post.id}
                      id={post.id}
                      title={post.title}
                      date={post.date}
                      excerpt={post.excerpt}
                      category={post.category}
                      coverImage={post.coverImage}
                      readingTime={post.readingTime}
                      variant="compact"
                    />
                  ))}
                </div>
              ) : (
                <p className="font-sans text-ink/40 italic">Nenhum artigo nesta categoria ainda.</p>
              )}

              {posts.length > 3 && (
                <div className="mt-4 text-right">
                  <Link href={`/categorias/${cat.slug}`}
                    className="font-display text-xs tracking-[0.2em] uppercase font-semibold text-burgundy hover:text-burgundy-light transition-colors">
                    {"Ver todos \u2192"}
                  </Link>
                </div>
              )}

              <div className="h-px bg-gray-200 mt-10" />
            </section>
          )
        })}

        {categorias.length === 0 && (
          <div className="text-center py-20">
            <p className="font-serif text-xl text-ink/40">Nenhuma categoria cadastrada ainda.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const categorias = getCategoriasLocal()
  const allPosts = getSortedPostsData()
  const settings = await getSettings()

  const postsByCategory = {}
  categorias.forEach(cat => {
    postsByCategory[cat.slug] = allPosts.filter(
      p => p.category && p.category.toLowerCase() === cat.label.toLowerCase()
    )
  })

  return { props: { categorias, postsByCategory, settings } }
}
