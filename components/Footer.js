import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

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
              "Toda a Escritura é divinamente inspirada e útil para ensinar, para repreender,
              para corrigir e para instruir na justiça."
            </p>
            <p className="font-display text-xs text-gold mt-2">— 2 Tim 3,16</p>
          </div>

          {/* Links */}
          <div className="text-center">
            <p className="font-display text-xs tracking-[0.3em] text-gold uppercase mb-4">Navegação</p>
            <ul className="space-y-2 font-sans text-sm">
              <li><Link href="/" className="hover:text-gold transition-colors">Início</Link></li>
              <li><Link href="/categorias" className="hover:text-gold transition-colors">Categorias</Link></li>
              <li><Link href="/sobre" className="hover:text-gold transition-colors">Sobre o Blog</Link></li>
              <li>
                <a href="https://www.editoraecclesiae.com.br" target="_blank" rel="noopener noreferrer"
                  className="hover:text-gold transition-colors">
                  Loja da Editora ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right">
            <p className="font-display text-xs tracking-[0.3em] text-gold uppercase mb-4">Contato</p>
            <p className="font-sans text-sm text-cream/60 mb-1">contato@editoraecclesiae.com.br</p>
            <div className="flex justify-center md:justify-end gap-4 mt-4">
              <a href="https://instagram.com/editoraecclesiae" target="_blank" rel="noopener noreferrer"
                className="font-display text-xs tracking-widest uppercase hover:text-gold transition-colors">
                Instagram
              </a>
              <span className="text-gold/30">·</span>
              <a href="https://facebook.com/editoraecclesiae" target="_blank" rel="noopener noreferrer"
                className="font-display text-xs tracking-widest uppercase hover:text-gold transition-colors">
                Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gold/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="font-sans text-xs text-cream/40">
            © {year} Editora Ecclesiae. Todos os direitos reservados.
          </p>
          <p className="font-display text-xs text-gold/60 tracking-widest">
            ✠ Ad Maiorem Dei Gloriam ✠
          </p>
        </div>
      </div>
    </footer>
  )
}
