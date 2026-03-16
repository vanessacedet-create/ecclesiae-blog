import Link from 'next/link'
import { useState } from 'react'

export default function Header({ categorias = [] }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="relative bg-burgundy text-cream">
      <div className="h-1 bg-gradient-to-r from-burgundy-dark via-gold to-burgundy-dark" />

      <div className="bg-cross-pattern">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center">
          <div className="text-gold text-2xl mb-3 tracking-widest font-display">{"\u2726 \u2726 \u2726"}</div>

          <Link href="/" className="group inline-block">
            <p className="font-display text-xs tracking-[0.4em] text-gold uppercase mb-2">
              Editora Ecclesiae
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-cream group-hover:text-gold transition-colors duration-300">
              O BLOG
            </h1>
            <p className="font-sans italic text-gold-light text-lg mt-2 tracking-wide">
              {"F\u00e9, Cultura e Tradi\u00e7\u00e3o Cat\u00f3lica"}
            </p>
          </Link>

          <div className="flex items-center justify-center gap-4 my-5">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-gold" />
            <span className="text-gold text-lg">{"\u2720"}</span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-gold" />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-6 font-display text-xs tracking-[0.2em] uppercase flex-wrap">
            <Link href="/" className="text-cream/80 hover:text-gold transition-colors duration-200">
              {"In\u00edcio"}
            </Link>

            {categorias.map((cat, i) => (
              <span key={cat.id} className="flex items-center gap-6">
                <span className="text-gold/40">{"\u00b7"}</span>
                <Link
                  href={`/categorias/${cat.slug}`}
                  className="text-cream/80 hover:text-gold transition-colors duration-200"
                >
                  {cat.label}
                </Link>
              </span>
            ))}

            <span className="text-gold/40">{"\u00b7"}</span>
            <a
              href="https://www.editoraecclesiae.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-light transition-colors duration-200"
            >
              {"Loja \u2197"}
            </a>
          </nav>

          {/* Mobile menu */}
          <button
            className="md:hidden mt-2 text-gold font-display text-xs tracking-widest uppercase"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? 'Fechar \u2715' : 'Menu \u2261'}
          </button>

          {menuOpen && (
            <nav className="md:hidden flex flex-col items-center gap-4 mt-4 font-display text-xs tracking-widest uppercase">
              <Link href="/" className="text-cream/80 hover:text-gold" onClick={() => setMenuOpen(false)}>
                {"In\u00edcio"}
              </Link>
              {categorias.map(cat => (
                <Link
                  key={cat.id}
                  href={`/categorias/${cat.slug}`}
                  className="text-cream/80 hover:text-gold"
                  onClick={() => setMenuOpen(false)}
                >
                  {cat.label}
                </Link>
              ))}
              <a
                href="https://www.editoraecclesiae.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold"
              >
                {"Loja \u2197"}
              </a>
            </nav>
          )}
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-burgundy-dark via-gold-light to-burgundy-dark opacity-50" />
    </header>
  )
}
