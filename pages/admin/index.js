import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const STATUS_LABELS = {
  published: { label: 'Publicado', color: '#4caf50' },
  draft: { label: 'Rascunho', color: '#ff9800' },
  scheduled: { label: 'Agendado', color: '#2196f3' },
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status])

  useEffect(() => {
    if (session) fetchPosts()
  }, [session])

  async function fetchPosts() {
    setLoading(true)
    const res = await fetch('/api/github/posts')
    const data = await res.json()
    setPosts(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  async function handleDelete(post) {
    if (!confirm(`Tem certeza que deseja excluir "${post.title}"?`)) return
    setDeleting(post.id)
    await fetch(`/api/github/post/${post.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sha: post.sha, title: post.title }),
    })
    await fetchPosts()
    setDeleting(null)
  }

  const filtered = posts.filter(p =>
    !search || p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  if (status === 'loading' || !session) return null

  return (
    <>
      <Head>
        <title>Painel — CMS Ecclesiae</title>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#FAF7F2', fontFamily: "'EB Garamond', serif" }}>

        {/* Top bar */}
        <header style={{
          background: '#5C1E1E',
          borderBottom: '2px solid #B8943F',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#B8943F', fontSize: '20px' }}>✠</span>
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#FAF7F2',
            }}>
              Ecclesiae CMS
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <a href="/" target="_blank" style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#B8943F',
              textDecoration: 'none',
            }}>
              Ver Blog ↗
            </a>
            <button onClick={() => signOut({ callbackUrl: '/admin/login' })} style={{
              background: 'transparent',
              border: '1px solid rgba(184,148,63,0.4)',
              color: 'rgba(250,247,242,0.6)',
              fontFamily: "'Cinzel', serif",
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              padding: '6px 14px',
              cursor: 'pointer',
            }}>
              Sair
            </button>
          </div>
        </header>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>

          {/* Page header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '26px',
                fontWeight: '600',
                color: '#5C1E1E',
                margin: '0 0 6px',
              }}>
                Posts do Blog
              </h1>
              <p style={{ margin: 0, color: '#888', fontStyle: 'italic', fontSize: '16px' }}>
                {posts.length} artigo{posts.length !== 1 ? 's' : ''} no repositório
              </p>
            </div>
            <Link href="/admin/novo" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#5C1E1E',
              color: '#FAF7F2',
              textDecoration: 'none',
              fontFamily: "'Cinzel', serif",
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              padding: '12px 24px',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#7D2E2E'}
              onMouseLeave={e => e.currentTarget.style.background = '#5C1E1E'}
            >
              <span style={{ fontSize: '16px' }}>+</span> Novo Post
            </Link>
          </div>

          {/* Search */}
          <div style={{ marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="Buscar por título ou categoria..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: '10px 16px',
                border: '1px solid rgba(92,30,30,0.2)',
                background: 'white',
                fontFamily: "'EB Garamond', serif",
                fontSize: '16px',
                color: '#1A1208',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Posts table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px', color: '#B8943F' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>✠</div>
              <p style={{ fontStyle: 'italic', color: '#888' }}>Carregando posts do GitHub...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px',
              border: '1px dashed rgba(184,148,63,0.3)',
              background: 'white',
            }}>
              <div style={{ fontSize: '40px', color: 'rgba(184,148,63,0.3)', marginBottom: '16px' }}>✠</div>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: '14px', color: '#5C1E1E', marginBottom: '8px' }}>
                {search ? 'Nenhum post encontrado' : 'Nenhum post ainda'}
              </p>
              {!search && (
                <Link href="/admin/novo" style={{ color: '#B8943F', fontStyle: 'italic', fontSize: '15px' }}>
                  Criar o primeiro artigo →
                </Link>
              )}
            </div>
          ) : (
            <div style={{ background: 'white', border: '1px solid rgba(92,30,30,0.1)' }}>
              {filtered.map((post, i) => (
                <div key={post.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '18px 24px',
                  borderBottom: i < filtered.length - 1 ? '1px solid rgba(92,30,30,0.07)' : 'none',
                  transition: 'background 0.15s',
                  background: 'white',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FAF7F2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#5C1E1E',
                      }}>
                        {post.title || post.id}
                      </span>
                      {post.status && STATUS_LABELS[post.status] && (
                        <span style={{
                          fontSize: '10px',
                          fontFamily: "'Cinzel', serif",
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          color: STATUS_LABELS[post.status].color,
                          border: `1px solid ${STATUS_LABELS[post.status].color}`,
                          padding: '2px 8px',
                        }}>
                          {STATUS_LABELS[post.status].label}
                        </span>
                      )}
                      {post.category && (
                        <span style={{
                          fontSize: '10px',
                          fontFamily: "'Cinzel', serif",
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          color: '#B8943F',
                        }}>
                          {post.category}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '13px', color: '#999', fontStyle: 'italic' }}>
                      {post.date && <span>{post.date}</span>}
                      {post.author && <span> · {post.author}</span>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link href={`/admin/editar/${post.id}`} style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: '10px',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: '#5C1E1E',
                      textDecoration: 'none',
                      border: '1px solid rgba(92,30,30,0.3)',
                      padding: '6px 14px',
                      transition: 'all 0.15s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#5C1E1E'; e.currentTarget.style.color = '#FAF7F2' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#5C1E1E' }}
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(post)}
                      disabled={deleting === post.id}
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '10px',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: '#c62828',
                        background: 'transparent',
                        border: '1px solid rgba(198,40,40,0.3)',
                        padding: '6px 14px',
                        cursor: deleting === post.id ? 'not-allowed' : 'pointer',
                        opacity: deleting === post.id ? 0.5 : 1,
                      }}
                    >
                      {deleting === post.id ? '...' : 'Excluir'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
