import Link from 'next/link'
import { useState } from 'react'

export default function Header({ categorias = [] }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="relative bg-burgundy text-cream">
      <div className="h-1 bg-gradient-to-r from-burgundy-dark via-gold to-burgundy-dark" />
      <div className="bg-cross-pattern">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center">
          <div className="text-gold text-2xl mb-3 tracking-widest font-display">✦ ✦ ✦</div>
          <Link href="/" className="group inline-block">
            <p className="font-display text-xs tracking-[0.4em] text-gold uppercase mb-2">Editora Ecclesiae</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-cream group-hover:text-gold transition-colors duration-300">O BLOG</h1>
            <p className="font-sans italic text-gold-light text-lg mt-2 tracking-wide">Fé, Cultura e Tradição Católica</p>
          </Link>
          <div className="flex items-center justify-center gap-4 my-5">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-gold" />
            <span className="text-gold text-lg">✠</span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-gold" />
          </div>
          <nav className="hidden md:flex items-center justify-center gap-6 font-display text-xs tracking-[0.2em] uppercase flex-wrap">
            <Link href="/" className="text-cream/80 hover:text-gold transition-colors duration-200">Início</Link>
            {categorias.map((cat) => (
              <span key={cat.id} className="flex items-center gap-6">
                <span className="text-gold/40">·</span>
                <Link href={`/categorias/${cat.slug}`} className="text-cream/80 hover:text-gol
