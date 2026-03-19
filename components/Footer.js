import Link from 'next/link'

export default function Footer({ settings = {} }) {
  const year = new Date().getFullYear()
  const storeUrl = settings.storeUrl || 'https://www.editoraecclesiae.com.br'
  const email = settings.email || 'contato@editoraecclesiae.com.br'

  const socials = [
    { key: 'instagram', label: 'Instagram' },
    { key: 'facebook', label: 'Facebook' },
    { key: 'youtube', label: 'YouTube' },
    { key: 'twitter', label: 'X' },
    { key: 'tiktok', label: 'TikTok' },
  ].filter(s => settings[s.key])

  return (
    <footer className="bg-burgundy-dark text-cream/70">
      <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div className="text-center md:text-left">
            <p className="font-display text-xs tracking-[0.3em] text-gold uppercase font-semibold mb-2">Editora Ecclesiae</p>
            <h3 className="font-display text-xl text-cream mb-4">O Blog</h3>
            <p className="font-sans text-sm leading-relaxed text-cream/50">
              {'"Toda a Escritura \u00e9 divinamente inspirada e \u00fatil para ensinar, para repreender, para corrigir e para instruir na justi\u00e7a."'}
            </p>
            <p className="font-display text-xs text-gold/70 mt-2">{"\u2014 2 Tim 3,16"}</p>
          </div>

          {/* Navigation */}
          <div className="text-center">
            <p className="font-display text-xs tracking-[0.3em] text-gold uppercase font-semibold mb-5">{"Navega\u00e7\u00e3o"}</p>
            <ul className="space-y-3 font-sans text-sm">
              <li><Link href="/" className="text-cream/60 hover:text-gold transition-colors">{"In\u00edcio"}</Link></li>
              <li><Link href="/categorias" className="text-cream/60 hover:text-gold transition-colors">Categorias</Link></li>
              <li><Link href="/sobre" className="text-cream/60 hover:text-gold transition-colors">Sobre o Blog</Link></li>
              <li>
                <a href={storeUrl} target="_blank" rel="noopener noreferrer"
                  className="text-cream/60 hover:text-gold transition-colors">
                  {"Loja da Editora \u2197"}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social - reorganized as list */}
          <div className="text-center md:text-right">
            <p className="font-display text-xs tracking-[0.3em] text-gold uppercase font-semibold mb-5">Contato</p>
            <ul className="space-y-3 font-sans text-sm">
              {socials.map(social => (
                <li key={social.key}>
                  <a
                    href={settings[social.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/60 hover:text-gold transition-colors"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
              <li className="text-cream/50">{email}</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gold/15 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs text-cream/35">
            {"\u00a9"} {year} Editora Ecclesiae. Todos os direitos reservados.
          </p>
          <p className="font-display text-xs text-gold/40 tracking-widest">
            Ad Maiorem Dei Gloriam
          </p>
        </div>
      </div>
    </footer>
  )
}
