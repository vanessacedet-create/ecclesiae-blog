import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'

const SOCIAL_ICONS = {
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  facebook: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  youtube: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  ),
  twitter: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l11.733 16h4.267l-11.733-16zM4 20l6.768-6.768M13.232 10.768L20 4" />
    </svg>
  ),
  tiktok: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  ),
}

export default function Header({ categorias = [], settings = {} }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)
  const router = useRouter()

  const storeUrl = settings.storeUrl || 'https://www.editoraecclesiae.com.br'
  const socials = ['instagram', 'facebook', 'youtube', 'twitter', 'tiktok']
    .filter(key => settings[key])

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
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <img
              src="/logo-ecclesiae.png"
              alt="Editora Ecclesiae"
              className="h-10 md:h-12 w-auto"
              onError={(e) => {
                e.target.style.display = 'none'
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'
              }}
            />
            <span className="hidden items-center gap-2" style={{ display: 'none' }}>
              <span className="font-display text-lg text-burgundy font-bold tracking-wide">
                Ecclesiae
              </span>
            </span>
          </Link>

          {/* Desktop Navigation - font-weight increased */}
          <nav className="hidden lg:flex items-center gap-7 font-display text-xs tracking-[0.18em] uppercase font-semibold">
            <Link href="/" className="text-ink/80 hover:text-burgundy transition-colors duration-200">
              {"In\u00edcio"}
            </Link>
            {categorias.map((cat) => (
              <Link
                key={cat.id}
                href={`/categorias/${cat.slug}`}
                className="text-ink/80 hover:text-burgundy transition-colors duration-200"
              >
                {cat.label}
              </Link>
            ))}
          </nav>

          {/* Right side: social icons + search + loja + mobile menu */}
          <div className="flex items-center gap-3">

            {/* Social icons - horizontal, desktop only */}
            {socials.length > 0 && (
              <div className="hidden md:flex items-center gap-2">
                {socials.map(key => (
                  <a
                    key={key}
                    href={settings[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink/35 hover:text-burgundy transition-colors duration-200 p-1"
                    title={key.charAt(0).toUpperCase() + key.slice(1)}
                  >
                    {SOCIAL_ICONS[key]}
                  </a>
                ))}
                <span className="w-px h-5 bg-gray-200 mx-1" />
              </div>
            )}

            {/* Search toggle - with hover effect */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-ink/40 hover:text-burgundy hover:bg-burgundy/5 transition-all duration-200 p-2 rounded-full"
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
              className="hidden md:inline-block font-display text-xs tracking-[0.15em] uppercase font-semibold text-cream bg-burgundy hover:bg-burgundy-light px-5 py-2 transition-colors duration-200"
            >
              Loja
            </a>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden text-ink/60 hover:text-burgundy transition-colors p-1"
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
                className="text-ink/40 hover:text-ink transition-colors text-sm font-display tracking-widest uppercase font-semibold"
              >
                Fechar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <nav className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-4">
            <Link href="/" className="font-display text-xs tracking-[0.2em] uppercase font-semibold text-ink/80 hover:text-burgundy transition-colors"
              onClick={() => setMenuOpen(false)}>
              {"In\u00edcio"}
            </Link>
            {categorias.map(cat => (
              <Link key={cat.id} href={`/categorias/${cat.slug}`}
                className="font-display text-xs tracking-[0.2em] uppercase font-semibold text-ink/80 hover:text-burgundy transition-colors"
                onClick={() => setMenuOpen(false)}>
                {cat.label}
              </Link>
            ))}
            <div className="h-px bg-gray-100 my-2" />
            {/* Mobile social icons */}
            {socials.length > 0 && (
              <div className="flex items-center gap-3 py-1">
                {socials.map(key => (
                  <a key={key} href={settings[key]} target="_blank" rel="noopener noreferrer"
                    className="text-ink/40 hover:text-burgundy transition-colors p-1">
                    {SOCIAL_ICONS[key]}
                  </a>
                ))}
              </div>
            )}
            <a href={storeUrl} target="_blank" rel="noopener noreferrer"
              className="font-display text-xs tracking-[0.2em] uppercase font-semibold text-burgundy hover:text-gold transition-colors"
              onClick={() => setMenuOpen(false)}>
              {"Loja \u2197"}
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
