import Layout from '../components/Layout'
import PostCard from '../components/PostCard'
import { getSortedPostsData } from '../lib/posts'

export default function Home({ allPostsData }) {
  const featuredPost = allPostsData[0]
  const restPosts = allPostsData.slice(1)

  return (
    <Layout>
      {/* Featured post */}
      {featuredPost && (
        <section className="max-w-5xl mx-auto px-6 pt-12 animate-fade-up">
          <div className="ornamental-divider mb-8">
            <span className="font-display text-xs tracking-[0.3em] uppercase text-gold">
              Artigo em Destaque
            </span>
          </div>
          <PostCard
            id={featuredPost.id}
            title={featuredPost.title}
            date={featuredPost.date}
            excerpt={featuredPost.excerpt}
            category={featuredPost.category}
            featured={true}
          />
        </section>
      )}

      {/* Recent posts grid */}
      {restPosts.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="ornamental-divider mb-10">
            <span className="font-display text-xs tracking-[0.3em] uppercase text-gold">
              Artigos Recentes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restPosts.map((post, i) => (
              <div
                key={post.id}
                className={`animate-fade-up-delay-${Math.min(i + 1, 3)}`}
              >
                <PostCard
                  id={post.id}
                  title={post.title}
                  date={post.date}
                  excerpt={post.excerpt}
                  category={post.category}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {allPostsData.length === 0 && (
        <div className="max-w-5xl mx-auto px-6 py-32 text-center">
          <span className="font-display text-6xl text-gold/30">✠</span>
          <p className="font-serif text-2xl text-burgundy mt-6 mb-3">Em breve, novos artigos</p>
          <p className="font-sans text-ink/50 italic">O blog está sendo preparado com muito cuidado.</p>
        </div>
      )}

      {/* Bottom quote */}
      <section className="bg-parchment border-t border-b border-gold/20 py-14 text-center px-6">
        <div className="max-w-2xl mx-auto">
          <span className="text-gold text-2xl">✠</span>
          <blockquote className="font-serif text-2xl italic text-burgundy mt-4 mb-3 leading-relaxed">
            "Senhor, para quem iremos? Tu tens palavras de vida eterna."
          </blockquote>
          <cite className="font-display text-xs tracking-[0.3em] uppercase text-gold">
            João 6, 68
          </cite>
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData,
    },
  }
}
