import Layout from '../../components/Layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'

export default function Post({ postData }) {
  const formattedDate = postData.date
    ? format(parseISO(postData.date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : ''

  return (
    <Layout title={postData.title} description={postData.excerpt}>
      <article className="max-w-3xl mx-auto px-6 py-12">

        {/* Breadcrumb */}
        <nav className="mb-8 animate-fade-up">
          <Link href="/" className="font-display text-xs tracking-widest uppercase text-gold hover:text-gold-light transition-colors">
            ← Voltar ao Blog
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-10 animate-fade-up-delay-1">
          {postData.category && (
            <span className="inline-block font-display text-xs tracking-[0.3em] uppercase text-gold mb-4">
              {postData.category}
            </span>
          )}

          <h1 className="font-display text-4xl md:text-5xl font-bold text-burgundy leading-tight mb-5">
            {postData.title}
          </h1>

          {postData.excerpt && (
            <p className="font-sans text-xl italic text-ink/70 leading-relaxed mb-6">
              {postData.excerpt}
            </p>
          )}

          <div className="flex items-center gap-4 text-ink/50">
            {postData.author && (
              <>
                <span className="font-sans text-sm">{postData.author}</span>
                <span className="text-gold/40">·</span>
              </>
            )}
            <span className="font-sans text-sm">{formattedDate}</span>
          </div>
        </header>

        {/* Ornamental divider */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-gold/60 to-transparent" />
          <span className="text-gold">✠</span>
          <div className="h-px flex-1 bg-gradient-to-l from-gold/60 to-transparent" />
        </div>

        {/* Content */}
        <div
          className="prose-ecclesiae animate-fade-up-delay-2"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
        />

        {/* Bottom ornament */}
        <div className="flex items-center justify-center gap-4 mt-16 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
          <span className="text-gold text-lg">✦ ✠ ✦</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
        </div>

        {/* Back link */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block font-display text-xs tracking-[0.3em] uppercase text-burgundy border border-burgundy/30 px-6 py-3 hover:bg-burgundy hover:text-cream transition-all duration-300"
          >
            ← Ver todos os artigos
          </Link>
        </div>
      </article>
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id)
  return {
    props: {
      postData,
    },
  }
}
