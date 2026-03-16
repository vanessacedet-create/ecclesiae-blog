import { useEffect, useState } from 'react'

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

export default function SocialSidebar({ settings }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!settings) return null

  const socials = ['instagram', 'facebook', 'youtube', 'twitter', 'tiktok']
    .filter(key => settings[key])

  if (socials.length === 0) return null

  return (
    <div
      className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-50 flex-col items-center gap-1 transition-all duration-500"
      style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }}
    >
      {/* Label */}
      <span
        className="font-display text-xs tracking-[0.2em] uppercase text-burgundy/50 mb-2"
        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: '9px', letterSpacing: '0.25em' }}
      >
        Siga-nos
      </span>

      {/* Social icons */}
      {socials.map(key => (
        <a
          key={key}
          href={settings[key]}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 text-burgundy/50 hover:text-burgundy hover:bg-gold/10 transition-all duration-200 rounded-full"
          title={key.charAt(0).toUpperCase() + key.slice(1)}
        >
          {SOCIAL_ICONS[key]}
        </a>
      ))}

      {/* Divider */}
      <div className="w-px h-6 bg-burgundy/15 my-1" />

      {/* Store link */}
      {settings.storeUrl && (
        <a
          href={settings.storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 text-gold hover:text-gold-dark hover:bg-gold/10 transition-all duration-200 rounded-full"
          title="Loja"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </a>
      )}
    </div>
  )
}
