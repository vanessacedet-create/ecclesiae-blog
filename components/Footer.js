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
    <footer className="bg-burgundy-dark text-cream/70 mt-20">
      <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div className="text-center md:text-left">
            <p className="font-display text-xs tracking-[0.3em] text-gold uppercase mb-2">Editora Ecclesiae</p>
            <h3 className="font-display text-xl text-cream mb-3">O Blog</h3>
            <p className="font-sans text-sm leading-relaxed text-cream/60 italic">
              {'"Toda a Escritura \u00e9 divinamente inspirada e \u00fatil para ensinar, para repreender, para corrigir e para instruir na justi\u00e7a."'}
            </p>
            <p className="font-display text-xs text-gold mt-2">{"\u2014 2 Tim 3,16"}</p>
          </div>
          {/* Links */}
          <div className="text-center">
            <p className="font-display text-xs tracking-[0.3em] text-gold uppercase mb-4">{"Navega\u00e7\u00e3o"}</p>
            <ul className="space-y-2 font-sans text-sm">
              <li><Link href="/" className="hover:text-gold transition-colors">{"In\u00edcio"}</Link></li>
              <li><Link href="/categorias" className="hover:text-gold transition-colors">Categorias</Link></li>
              <li><Link href="/sobre" className="hover:text-gold transition-colors">Sobre o Blog</Link></li>
              <li>
                <a href={storeUrl} target="_blank" rel="noopener noreferrer"
                  className="hover:text-gold transition-colors">
                  {"Loja da Editora \u2197"}
                </a>
              </li>
            </ul>
          </div>
          {/* Contact & Social */}
          <div className="text-center md:text-right">
            <p className="font-display text-xs tracking-[0.3em] text-gold uppercase mb-4">Contato</p>
            <p className="font-sans text-sm text-cream/60 mb-3">{email}</p>
            {socials.length > 0 && (
              <div className="flex justify-center md:justify-end gap-4 mt-4 flex-wrap">
                {socials.map((social, i) => (
                  <span key={social.key} className="flex items-center gap-4">
                    {i > 0 && <span className="text-gold/30">{"\u00b7"}</span>}
                    <a
                      href={settings[social.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-display text-xs tracking-widest uppercase hover:text-gold transition-colors"
                    >
                      {social.label}
                    </a>
                  </span>
                ))}
              </div>
            )}
            {socials.length === 0 && (
              <div className="flex justify-center md:justify-end gap-4 mt-4">
                <span className="font-display text-xs tracking-widest uppercase text-cream/40">
                  Redes sociais em breve
                </span>
              </div>
            )}
          </div>
        </div>
        {/* Bottom */}
        <div className="border-t border-gold/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="font-sans text-xs text-cream/40">
            {"\u00a9"} {year} Editora Ecclesiae. Todos os direitos reservados.
          </p>
          <p className="font-display text-xs text-gold/60 tracking-widest">
            {"\u2720 Ad Maiorem Dei Gloriam \u2720"}
          </p>
        </div>
      </div>
    </footer>
  )
}
