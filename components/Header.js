import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="relative bg-burgundy text-cream">
      {/* Top ornamental bar */}
      <div className="h-1 bg-gradient-to-r from-burgundy-dark via-gold to-burgundy-dark" />

      {/* Main header */}
      <div className="bg-cross-pattern">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center">
          {/* Small cross ornament */}
          <div className="text-gold text-2xl mb-3 tracking-widest font-display">✦ ✦ ✦</div>

          <Link href="/" className="group inline-block">
            <p className="font-display text-xs tracking-[0.4em] text-gold uppercase mb-2">
              Editora Ecclesiae
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-cream group-hover:text-gold transition-colors duration-300">
              O BLOG
            </h1>
            <p className="font-sans italic text-gold-light text-lg mt-2 tracking-wide">
              Fé, Cultura e Tradição Católica
            </p>
          </Link>

          {/* Ornamental divider */}
          <div className="flex items-center justify-center gap-4 my-5">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-gold" />
            <span className="text-gold text-lg">✠</span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-gold" />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-8 font-display text-xs tracking-[0.2em] uppercase">
            <Link href="/" className="text-cream/80 hover:text-gold transition-colors duration-200">Início</Link>
            <span className="text-gold/40">·</span>
            <Link href="/categorias" className="text-cream/80 hover:text-gold transition-colors duration-200">Categorias</Link>
            <span className="text-gold/40">·</span>
            <Link href="/sobre" className="text-cream/80 hover:text-gold transition-colors duration-200">Sobre</Link>
            <span className="text-gold/40">·</span>
            <a href="https://www.editoraecclesiae.com.br" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light transition-colors duration-200">
              Loja ↗
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden mt-2 text-gold font-display text-xs tracking-widest uppercase"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? 'Fechar ✕' : 'Menu ≡'}
          </button>

          {menuOpen && (
            <nav className="md:hidden flex flex-col items-center gap-4 mt-4 font-display text-xs tracking-widest uppercase">
              <Link href="/" className="text-cream/80 hover:text-gold" onClick={() => setMenuOpen(false)}>Início</Link>
              <Link href="/categorias" className="text-cream/80 hover:text-gold" onClick={() => setMenuOpen(false)}>Categorias</Link>
              <Link href="/sobre" className="text-cream/80 hover:text-gold" onClick={() => setMenuOpen(false)}>Sobre</Link>
              <a href="https://www.editoraecclesiae.com.br" target="_blank" rel="noopener noreferrer" className="text-gold">Loja ↗</a>
            </nav>
          )}
        </div>
      </div>

      {/* Bottom ornamental bar */}
      <div className="h-px bg-gradient-to-r from-burgundy-dark via-gold-light to-burgundy-dark opacity-50" />
    </header>
  )
}
