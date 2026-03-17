import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Header({ categorias = [], settings = {} }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)
  const router = useRouter()

  const storeUrl = settings.storeUrl || 'https://www.editoraecclesiae.com.br'

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  function handleSearch(e) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <header className="relative bg-white border-b border-gray-200">

      {/* Top bar: Logo + Nav + Search */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <img
              src="/logo-ecclesiae.png"
              alt="Blog da Editora Ecclesiae"
              className="h-10 md:h-12 w-auto"
              onError={(e) => {
                e.target.style.display = 'none'
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'
              }}
            />
            <span className="hidden items-center gap-2" style={{ display: 'none' }}>
              <span className="font-display text-lg text-burgundy font-bold tracking-wide">
                Editora Ecclesiae
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-display text-xs tracking-[0.2em] uppercase">
            <Link href="/" className="text-ink/70 hover:text-burgundy transition-colors duration-200">
              {"In\u00edcio"}
            </Link>
            {categorias.map((cat) => (
              <Link
                key={cat.id}
                href={`/categorias/${cat.slug}`}
                className="text-ink/70 hover:text-burgundy transition-colors duration-200"
              >
                {cat.label}
              </Link>
            ))}
          </nav>

          {/* Search + Loja + Mobile menu */}
          <div className="flex items-center gap-4">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-ink/50 hover:text-burgundy transition-colors duration-200"
              aria-label="Buscar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Loja link - desktop */}
            <a
              href={storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-block font-display text-xs tracking-[0.15em] uppercase text-white bg-burgundy hover:bg-burgundy-light px-5 py-2 transition-colors duration-200"
            >
              Loja
            </a>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-ink/60 hover:text-burgundy transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="absolute inset-x-0 top-full z-50 bg-white border-b border-gray-200 shadow-lg">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <form onSubmit={handleSearch} className="flex items-center gap-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold flex-shrink-0">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar artigos..."
                className="flex-1 font-serif text-lg text-ink outline-none placeholder-ink/30 bg-transparent"
              />
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                className="text-ink/40 hover:text-ink transition-colors text-sm font-display tracking-widest uppercase"
              >
                Fechar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-4">
            <Link href="/" className="font-display text-xs tracking-[0.2em] uppercase text-ink/70 hover:text-burgundy transition-colors"
              onClick={() => setMenuOpen(false)}>
              {"In\u00edcio"}
            </Link>
            {categorias.map(cat => (
              <Link key={cat.id} href={`/categorias/${cat.slug}`}
                className="font-display text-xs tracking-[0.2em] uppercase text-ink/70 hover:text-burgundy transition-colors"
                onClick={() => setMenuOpen(false)}>
                {cat.label}
              </Link>
            ))}
            <div className="h-px bg-gray-100 my-2" />
            <a href={storeUrl} target="_blank" rel="noopener noreferrer"
              className="font-display text-xs tracking-[0.2em] uppercase text-burgundy hover:text-gold transition-colors"
              onClick={() => setMenuOpen(false)}>
              {"Loja \u2197"}
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
