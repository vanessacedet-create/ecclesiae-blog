import Layout from '../components/Layout'

export default function Sobre() {
  return (
    <Layout title="Sobre" description="Sobre o Blog da Editora Ecclesiae">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <header className="text-center mb-12 animate-fade-up">
          <span className="font-display text-xs tracking-[0.4em] uppercase text-gold">Editora Ecclesiae</span>
          <h1 className="font-display text-4xl font-bold text-burgundy mt-3 mb-4">Sobre o Blog</h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gold/40" />
            <span className="text-gold">✠</span>
            <div className="h-px w-16 bg-gold/40" />
          </div>
        </header>

        <div className="prose-ecclesiae animate-fade-up-delay-1">
          <p>
            O Blog da Editora Ecclesiae nasce do mesmo espírito que anima toda a nossa missão editorial:
            levar a riqueza da fé católica, da teologia e da cultura cristã ao maior número possível de pessoas.
          </p>

          <p>
            Aqui você encontrará artigos sobre espiritualidade, liturgia, filosofia cristã, vidas de santos,
            teologia, e muito mais — escritos com profundidade, clareza e amor à Verdade.
          </p>

          <blockquote>
            "A beleza salvará o mundo."<br />
            <small>— Fiódor Dostoiévski</small>
          </blockquote>

          <h2>Nossa Missão</h2>
          <p>
            A Editora Ecclesiae tem como missão publicar e difundir obras que alimentem a inteligência e
            o coração dos católicos, contribuindo para uma fé adulta, fundamentada e capaz de dialogar com
            o mundo contemporâneo.
          </p>

          <h2>Visite Nossa Loja</h2>
          <p>
            Além dos artigos do blog, convidamos você a conhecer nosso catálogo de livros em{' '}
            <a href="https://www.editoraecclesiae.com.br" target="_blank" rel="noopener noreferrer">
              editoraecclesiae.com.br
            </a>.
          </p>
        </div>
      </div>
    </Layout>
  )
}
