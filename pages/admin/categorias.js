import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

function slugify(text) {
  return text.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-')
}

export default function AdminCategorias() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [categorias, setCategorias] = useState([])
  const [sha, setSha] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [novaCategoria, setNovaCategoria] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status])

  useEffect(() => {
    if (session) fetchCategorias()
  }, [session])

  async function fetchCategorias() {
    setLoading(true)
    const res = await fetch('/api/categorias')
    const data = await res.json()
    setCategorias(data.categorias || [])
    setSha(data.sha)
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    const res = await fetch('/api/categorias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categorias, sha }),
    })
    const data = await res.json()
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      await fetchCategorias()
    } else {
      alert('Erro ao salvar: ' + data.error)
    }
  }

  function handleAdd() {
    if (!novaCategoria.trim()) return
    const id = slugify(novaCategoria)
    if (categorias.find(c => c.id === id)) {
      alert('Já existe uma categoria com esse nome.')
      return
    }
    setCategorias([...categorias, { id, label: novaCategoria.trim(), slug: id }])
    setNovaCategoria('')
  }

  function handleDelete(id) {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return
    setCategorias(categorias.filter(c => c.id !== id))
  }

  function handleRename(id, newLabel) {
    setCategorias(categorias.map(c => c.id === id ? { ...c, label: newLabel } : c))
  }

  function handleMoveUp(index) {
    if (index === 0) return
    const newCats = [...categorias]
    ;[newCats[index - 1], newCats[index]] = [newCats[index], newCats[index - 1]]
    setCategorias(newCats)
  }

  function handleMoveDown(index) {
    if (index === categorias.length - 1) return
    const newCats = [...categorias]
    ;[newCats[index], newCats[index + 1]] = [newCats[index + 1], newCats[index]]
    setCategorias(newCats)
  }

  if (status === 'loading' || !session) return null

  return (
    <>
      <Head>
        <title>Categorias — CMS Ecclesiae</title>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#FAF7F2', fontFamily: "'EB Garamond', serif" }}>
        <header style={{
          background: '#5C1E1E', borderBottom: '2px solid #B8943F',
          padding: '0 32px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', height: '64px',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/admin" style={{
              color: 'rgba(250,247,242,0.6)', textDecoration: 'none',
              fontFamily: "'Cinzel', serif", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
            }}>← Voltar</Link>
            <span style={{ color: 'rgba(184,148,63,0.4)' }}>|</span>
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: '12px', color: '#FAF7F2', letterSpacing: '0.15em' }}>
              ⚙️ Gerenciar Categorias
            </span>
          </div>
          <button onClick={handleSave} disabled={saving} style={{
            background: saving ? 'rgba(184,148,63,0.5)' : '#B8943F',
            border: 'none', color: '#1a0f0a',
            fontFamily: "'Cinzel', serif", fontSize: '10px',
            fontWeight: '600', letterSpacing: '0.2em', textTransform: 'uppercase',
            padding: '8px 20px', cursor: saving ? 'not-allowed' : 'pointer',
          }}>
            {saving ? 'Salvando...' : saved ? '✓ Salvo!' : 'Salvar Categorias'}
          </button>
        </header>

        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ marginBottom: '36px' }}>
            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '24px', fontWeight: '600', color: '#5C1E1E', margin: '0 0 8px' }}>
              Categorias do Blog
            </h1>
            <p style={{ margin: 0, color: '#888', fontStyle: 'italic', fontSize: '16px' }}>
              Essas categorias aparecem no menu principal do blog.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#B8943F' }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>✠</div>
              <p style={{ fontStyle: 'italic', color: '#888' }}>Carregando categorias...</p>
            </div>
          ) : (
            <div style={{ marginBottom: '32px' }}>
              {categorias.map((cat, index) => (
                <div key={cat.id} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '14px 16px', background: 'white',
                  border: '1px solid rgba(92,30,30,0.12)',
                  borderTop: index === 0 ? '1px solid rgba(92,30,30,0.12)' : 'none',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <button onClick={() => handleMoveUp(index)} disabled={index === 0} style={{
                      background: 'transparent', border: '1px solid rgba(92,30,30,0.2)',
                      color: index === 0 ? '#ddd' : '#5C1E1E',
                      width: '24px', height: '22px', cursor: index === 0 ? 'not-allowed' : 'pointer',
                      fontSize: '10px', lineHeight: 1, padding: 0,
                    }}>▲</button>
                    <button onClick={() => handleMoveDown(index)} disabled={index === categorias.length - 1} style={{
                      background: 'transparent', border: '1px solid rgba(92,30,30,0.2)',
                      color: index === categorias.length - 1 ? '#ddd' : '#5C1E1E',
                      width: '24px', height: '22px', cursor: index === categorias.length - 1 ? 'not-allowed' : 'pointer',
                      fontSize: '10px', lineHeight: 1, padding: 0,
                    }}>▼</button
