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
      // Refresh sha
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
    setCategorias(categorias.map(c =>
      c.id === id ? { ...c, label: newLabel } : c
    ))
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

        {/* Header */}
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
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: saving ? 'rgba(184,148,63,0.5)' : '#B8943F',
              border: 'none', color: '#1a0f0a',
              fontFamily: "'Cinzel', serif", fontSize: '10px',
              fontWeight: '600', letterSpacing: '0.2em', textTransform: 'uppercase',
              padding: '8px 20px', cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Salvando...' : saved ? '✓ Salvo!' : 'Salvar Categorias'}
          </button>
        </header>

        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 24px' }}>

          {/* Page title */}
          <div style={{ marginBottom: '36px' }}>
            <h1 style={{
              fontFamily: "'Cinzel', serif", fontSize: '24px',
              fontWeight: '600', color: '#5C1E1E', margin: '0 0 8px',
            }}>
              Categorias do Blog
            </h1>
            <p style={{ margin: 0, color: '#888', fontStyle: 'italic', fontSize: '16px' }}>
              Essas categorias aparecem no menu principal do blog. Você pode renomear, reordenar ou excluir.
            </p>
          </div>

          {/* Categories list */}
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
                  padding: '14px 16px',
                  background: 'white',
                  border: '1px solid rgba(92,30,30,0.12)',
                  borderTop: index === 0 ? '1px solid rgba(92,30,30,0.12)' : 'none',
                  transition: 'background 0.15s',
                }}>

                  {/* Order buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      style={{
                        background: 'transparent', border: '1px solid rgba(92,30,30,0.2)',
                        color: index === 0 ? '#ddd' : '#5C1E1E',
                        width: '24px', height: '22px', cursor: index === 0 ? 'not-allowed' : 'pointer',
                        fontSize: '10px', lineHeight: 1, padding: 0,
                      }}
                    >▲</button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === categorias.length - 1}
                      style={{
                        background: 'transparent', border: '1px solid rgba(92,30,30,0.2)',
                        color: index === categorias.length - 1 ? '#ddd' : '#5C1E1E',
                        width: '24px', height: '22px', cursor: index === categorias.length - 1 ? 'not-allowed' : 'pointer',
                        fontSize: '10px', lineHeight: 1, padding: 0,
                      }}
                    >▼</button>
                  </div>

                  {/* Position number */}
                  <span style={{
                    fontFamily: "'Cinzel', serif", fontSize: '11px',
                    color: '#B8943F', minWidth: '20px', textAlign: 'center',
                  }}>
                    {index + 1}
                  </span>

                  {/* Label input */}
                  <input
                    type="text"
                    value={cat.label}
                    onChange={e => handleRename(cat.id, e.target.value)}
                    style={{
                      flex: 1, padding: '8px 12px',
                      border: '1px solid rgba(92,30,30,0.15)',
                      fontFamily: "'EB Garamond', serif", fontSize: '17px',
                      color: '#1A1208', outline: 'none', background: '#FAF7F2',
                    }}
                    onFocus={e => e.target.style.borderColor = '#B8943F'}
                    onBlur={e => e.target.style.borderColor = 'rgba(92,30,30,0.15)'}
                  />

                  {/* Slug preview */}
                  <span style={{
                    fontSize: '12px', color: '#bbb', fontStyle: 'italic',
                    minWidth: '140px', display: 'none',
                  }}>
                    /{cat.slug}
                  </span>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(cat.id)}
                    style={{
                      background: 'transparent', border: '1px solid rgba(198,40,40,0.25)',
                      color: '#c62828', width: '32px', height: '32px',
                      cursor: 'pointer', fontSize: '14px', flexShrink: 0,
                    }}
                    title="Excluir categoria"
                  >✕</button>
                </div>
              ))}

              {categorias.length === 0 && (
                <div style={{
                  textAlign: 'center', padding: '40px',
                  border: '1px dashed rgba(184,148,63,0.3)',
                  background: 'white', color: '#aaa', fontStyle: 'italic',
                }}>
                  Nenhuma categoria ainda. Adicione uma abaixo.
                </div>
              )}
            </div>
          )}

          {/* Add new category */}
          <div style={{
            background: 'white', border: '1px solid rgba(92,30,30,0.12)',
            padding: '20px 20px',
          }}>
            <label style={{
              display: 'block',
              fontFamily: "'Cinzel', serif", fontSize: '10px',
              letterSpacing: '0.25em', textTransform: 'uppercase',
              color: '#B8943F', marginBottom: '10px',
            }}>
              Adicionar Nova Categoria
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={novaCategoria}
                onChange={e => setNovaCategoria(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="Ex: Orações, Liturgia, Filosofia..."
                style={{
                  flex: 1, padding: '10px 14px',
                  border: '1px solid rgba(92,30,30,0.2)',
                  fontFamily: "'EB Garamond', serif", fontSize: '17px',
                  color: '#1A1208', outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = '#B8943F'}
                onBlur={e => e.target.style.borderColor = 'rgba(92,30,30,0.2)'}
              />
              <button
                onClick={handleAdd}
                style={{
                  background: '#5C1E1E', border: 'none', color: '#FAF7F2',
                  fontFamily: "'Cinzel', serif", fontSize: '10px',
                  fontWeight: '600', letterSpacing: '0.2em', textTransform: 'uppercase',
                  padding: '10px 20px', cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                + Adicionar
              </button>
            </div>
            {novaCategoria && (
              <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#aaa', fontStyle: 'italic' }}>
                URL: /categorias/{slugify(novaCategoria)}
              </p>
            )}
          </div>

          {/* Info box */}
          <div style={{
            marginTop: '24px', padding: '16px 20px',
            background: 'rgba(184,148,63,0.08)',
            border: '1px solid rgba(184,148,63,0.2)',
            fontSize: '14px', color: '#8B6914', fontStyle: 'italic',
            lineHeight: 1.6,
          }}>
            ✠ As alterações só são aplicadas no blog após clicar em <strong>"Salvar Categorias"</strong>. 
            O blog atualiza automaticamente em alguns segundos após salvar.
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(ctx) {
  const { getServerSession } = await import('next-auth/next')
  const { authOptions } = await import('../api/auth/[...nextauth]')
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session) return { redirect: { destination: '/admin/login', permanent: false } }
  return { props: {} }
}
