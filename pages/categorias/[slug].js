import Layout from '../../components/Layout'
import PostCard from '../../components/PostCard'
import { getSortedPostsData } from '../../lib/posts'
import { getCategoriasLocal } from '../../lib/categorias'
import { getSettings } from '../../lib/settings'
import Link from 'next/link'

export default function CategoriaPage({ categoria, posts, categorias, settings }) {
  return (
    <Layout title={categoria.label} categorias={categorias} settings={settings}>
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-20">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-3 text-sm">
          <Link href="/" className="font-sans text-ink/40 hover:text-burgundy transition-colors">
            {"In\u00edcio"}
          </Link>
          <span className="text-ink/20">/</span>
          <Link href="/categorias" className="font-sans text-ink/40 hover:text-burgundy transition-colors">
            Categorias
          </Link>
          <span className="text-ink/20">/</span>
          <span className="font-sans text-ink/60">{categoria.label}</span>
        </nav>

        <div className="mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-burgundy mb-3">
            {categoria.label}
          </h1>
          <p className="font-sans text-lg text-ink/50">
            {posts.length} {posts.length === 1 ? 'artigo' : 'artigos'} nesta categoria.
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
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
          <div className="text-center py-20">
            <p className="font-serif text-xl text-ink/40 mb-4">Nenhum artigo nesta categoria ainda.</p>
            <Link href="/" className="font-display text-xs tracking-[0.2em] uppercase font-semibold text-burgundy hover:text-burgundy-light transition-colors">
              {"\u2190 Voltar ao blog"}
            </Link>
          </div>
        )}
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  const categorias = getCategoriasLocal()
  const paths = categorias.map(cat => ({
    params: { slug: cat.slug },
  }))
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const categorias = getCategoriasLocal()
  const allPosts = getSortedPostsData()
  const settings = await getSettings()

  const categoria = categorias.find(c => c.slug === params.slug)
  if (!categoria) return { notFound: true }

  const posts = allPosts.filter(
    p => p.category && p.category.toLowerCase() === categoria.label.toLowerCase()
  )

  return { props: { categoria, posts, categorias, settings } }
}
