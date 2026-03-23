import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function AdminDashboard({ posts: initialPosts }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState(initialPosts || [])
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status])

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  async function handleArchive(post) {
    setDeleting(post.id)
    try {
      // Instead of deleting, change status to 'archived' (draft)
      const res = await fetch('/api/github/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: post.title,
          date: post.date,
          category: post.category,
          categories: post.categories || (post.category ? [post.category] : []),
          author: post.author || '',
          excerpt: post.excerpt || '',
          body: post.bodyPreview ? post.bodyPreview.replace('...', '') : '',
          slug: post.id,
          status: 'archived',
          coverImage: post.coverImage || '',
          coverPosition: post.coverPosition || '',
          metaTitle: post.metaTitle || '',
          metaDescription: post.metaDescription || '',
          tags: Array.isArray(post.tags) ? post.tags : [],
          scheduledAt: post.scheduledAt || '',
          sha: post.sha,
        }),
      })
      if (res.ok) {
        // Update local state to reflect archived status
        setPosts(posts.map(p => p.id === post.id ? { ...p, status: 'archived' } : p))
        setShowDeleteConfirm(null)
      } else {
        const data = await res.json()
        alert('Erro ao arquivar: ' + (data.error || 'Tente novamente'))
      }
    } catch (e) {
      alert('Erro ao arquivar: ' + e.message)
    }
    setDeleting(null)
  }

  async function handlePermanentDelete(post) {
    setDeleting(post.id)
    try {
      const res = await fetch('/api/github/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: post.path || `posts/${post.id}.md`, sha: post.sha, title: post.title }),
      })
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== post.id))
        setShowDeleteConfirm(null)
      } else {
        const data = await res.json()
        alert('Erro ao excluir: ' + (data.error || 'Tente novamente'))
      }
    } catch (e) {
      alert('Erro ao excluir: ' + e.message)
    }
    setDeleting(null)
  }

  if (status === 'loading' || !session) return null

  const cards = [
    { href: '/admin/novo', icon: '\u270E', title: 'Novo Artigo', desc: 'Escrever e publicar', dark: true },
    { href: '/admin/categorias', icon: '\u2630', title: 'Categorias', desc: 'Gerenciar categorias', dark: false },
    { href: '/admin/logo', icon: '\uD83C\uDFA8', title: 'Logo', desc: 'Enviar ou trocar', dark: false },
    { href: '/admin/settings', icon: '\u2699', title: 'Configura\u00e7\u00f5es', desc: 'Redes sociais e loja', dark: false },
    { href: '/', icon: '\uD83C\uDF10', title: 'Ver Blog', desc: 'Abrir como visitante', dark: false },
  ]

  return (
    <>
      <Head>
        <title>Painel Admin &mdash; CMS Ecclesiae</title>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: '100vh', background: '#fffdf7', fontFamily: "'EB Garamond', serif" }}>

        {/* Header */}
        <header style={{
          background: '#926d47',
          borderBottom: '2px solid #f3be4a',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <span style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '14px',
            fontWeight: '600',
            color: '#fffdf7',
            letterSpacing: '0.15em',
          }}>
            {'\u2720'} CMS Ecclesiae
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,253,247,0.6)', fontStyle: 'italic' }}>
              {session.user?.name || session.user?.email || 'Admin'}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              style={{
                background: 'transparent',
                border: '1px solid rgba(243,190,74,0.4)',
                color: '#f3be4a',
                fontFamily: "'Cinzel', serif",
                fontSize: '10px',
                fontWeight: '600',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                padding: '6px 14px',
                cursor: 'pointer',
              }}
            >
              Sair
            </button>
          </div>
        </header>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>

          {/* Welcome */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '32px', color: '#f3be4a', marginBottom: '12px' }}>{'\u2720'}</div>
            <h1 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '28px',
              fontWeight: '600',
              color: '#926d47',
              margin: '0 0 8px',
            }}>
              Painel Administrativo
            </h1>
            <p style={{ margin: 0, color: '#888', fontStyle: 'italic', fontSize: '16px' }}>
              Gerencie o blog da Editora Ecclesiae
            </p>
          </div>

          {/* Action cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '16px',
            marginBottom: '48px',
          }}>
            {cards.map((card) => (
              <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: card.dark ? '#926d47' : 'white',
                  border: card.dark ? 'none' : '1px solid rgba(146,109,71,0.12)',
                  padding: '24px 20px',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '10px' }}>{card.icon}</div>
                  <p style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '11px',
                    fontWeight: '600',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: card.dark ? '#fffdf7' : '#926d47',
                    margin: '0 0 4px',
                  }}>
                    {card.title}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: card.dark ? 'rgba(255,253,247,0.5)' : '#999',
                    fontStyle: 'italic',
                    margin: 0,
                  }}>
                    {card.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Posts list */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '18px',
                fontWeight: '600',
                color: '#926d47',
                margin: 0,
              }}>
                Artigos Publicados
              </h2>
              <Link href="/admin/novo" style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#f3be4a',
                textDecoration: 'none',
              }}>
                {'+ Novo artigo'}
              </Link>
            </div>

            {posts.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                border: '1px dashed rgba(243,190,74,0.3)',
                background: 'white',
                color: '#aaa',
                fontStyle: 'italic',
              }}>
                Nenhum artigo publicado ainda.
              </div>
            ) : (
              <div>
                {posts.map((post, index) => (
                  <div key={post.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 20px',
                    background: 'white',
                    border: '1px solid rgba(146,109,71,0.1)',
                    borderTop: index === 0 ? '1px solid rgba(146,109,71,0.1)' : 'none',
                  }}>
                    {/* Status dot */}
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: post.status === 'published' ? '#4caf50'
                        : post.status === 'scheduled' ? '#f3be4a'
                        : post.status === 'archived' ? '#e57373'
                        : '#ccc',
                      flexShrink: 0,
                    }} />

                    {/* Post info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        margin: '0 0 4px',
                        fontSize: '17px',
                        fontWeight: '500',
                        color: '#1A1208',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {post.title}
                      </p>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Show categories as small tags */}
                        {post.categories && Array.isArray(post.categories) && post.categories.map(cat => (
                          <span key={cat} style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: '9px',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: '#926d47',
                            border: '1px solid rgba(146,109,71,0.2)',
                            padding: '2px 8px',
                          }}>
                            {cat}
                          </span>
                        ))}
                        {/* Fallback to single category */}
                        {(!post.categories || !Array.isArray(post.categories)) && post.category && (
                          <span style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: '9px',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: '#926d47',
                            border: '1px solid rgba(146,109,71,0.2)',
                            padding: '2px 8px',
                          }}>
                            {post.category}
                          </span>
                        )}
                        <span style={{ fontSize: '12px', color: '#bbb' }}>{post.date}</span>
                        <span style={{
                          fontSize: '10px',
                          color: post.status === 'published' ? '#4caf50' : post.status === 'archived' ? '#e57373' : '#f3be4a',
                          fontStyle: 'italic',
                        }}>
                          {post.status === 'published' ? 'Publicado' : post.status === 'scheduled' ? 'Agendado' : post.status === 'archived' ? 'Arquivado' : 'Rascunho'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <Link href={`/admin/editar/${post.id}`} style={{
                        padding: '6px 14px',
                        border: '1px solid rgba(146,109,71,0.25)',
                        background: 'transparent',
                        color: '#926d47',
                        fontFamily: "'Cinzel', serif",
                        fontSize: '9px',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        cursor: 'pointer',
                      }}>
                        Editar
                      </Link>
                      <button
                        onClick={() => setShowDeleteConfirm(post)}
                        disabled={deleting === post.id}
                        style={{
                          padding: '6px 12px',
                          border: '1px solid rgba(198,40,40,0.2)',
                          background: 'transparent',
                          color: '#c62828',
                          fontFamily: "'Cinzel', serif",
                          fontSize: '9px',
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          cursor: deleting === post.id ? 'not-allowed' : 'pointer',
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

          {/* Info box */}
          <div style={{
            padding: '16px 20px',
            background: 'rgba(243,190,74,0.08)',
            border: '1px solid rgba(243,190,74,0.2)',
            fontSize: '14px',
            color: '#c99a2e',
            fontStyle: 'italic',
            lineHeight: 1.6,
            textAlign: 'center',
          }}>
            {'\u2720'} Use os cards acima para criar artigos, gerenciar categorias, trocar a logo ou visualizar o blog.
          </div>
        </div>

        {/* Delete confirmation modal */}
        {showDeleteConfirm && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(26,15,10,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
            onClick={(e) => e.target === e.currentTarget && setShowDeleteConfirm(null)}
          >
            <div style={{
              background: '#fffdf7', width: '100%', maxWidth: '440px',
              fontFamily: "'EB Garamond', serif",
            }}>
              <div style={{
                background: '#926d47', padding: '16px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#fffdf7' }}>
                  Excluir artigo
                </span>
                <button onClick={() => setShowDeleteConfirm(null)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,253,247,0.5)', cursor: 'pointer', fontSize: '18px' }}>{'\u2715'}</button>
              </div>

              <div style={{ padding: '28px' }}>
                <p style={{ fontSize: '18px', color: '#1A1208', margin: '0 0 6px', fontWeight: '600' }}>
                  {showDeleteConfirm.title}
                </p>
                <p style={{ fontSize: '15px', color: '#888', margin: '0 0 24px' }}>
                  O que deseja fazer com este artigo?
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Archive as draft */}
                  <button
                    onClick={() => handleArchive(showDeleteConfirm)}
                    disabled={deleting}
                    style={{
                      width: '100%', padding: '12px 20px',
                      background: '#f3be4a', border: 'none', color: '#1a0f0a',
                      fontFamily: "'Cinzel', serif", fontSize: '10px', fontWeight: '600',
                      letterSpacing: '0.15em', textTransform: 'uppercase',
                      cursor: deleting ? 'not-allowed' : 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    {deleting ? 'Processando...' : 'Mover para rascunho (recomendado)'}
                  </button>

                  {/* Permanent delete */}
                  <button
                    onClick={() => handlePermanentDelete(showDeleteConfirm)}
                    disabled={deleting}
                    style={{
                      width: '100%', padding: '12px 20px',
                      background: 'transparent', border: '1px solid rgba(198,40,40,0.3)',
                      color: '#c62828',
                      fontFamily: "'Cinzel', serif", fontSize: '10px', fontWeight: '600',
                      letterSpacing: '0.15em', textTransform: 'uppercase',
                      cursor: deleting ? 'not-allowed' : 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    {deleting ? 'Processando...' : 'Excluir permanentemente'}
                  </button>

                  {/* Cancel */}
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    style={{
                      width: '100%', padding: '10px 20px',
                      background: 'transparent', border: '1px solid rgba(146,109,71,0.2)',
                      color: '#926d47',
                      fontFamily: "'Cinzel', serif", fontSize: '10px',
                      letterSpacing: '0.15em', textTransform: 'uppercase',
                      cursor: 'pointer', textAlign: 'center',
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export async function getServerSideProps(ctx) {
  try {
    const { getServerSession } = await import('next-auth/next')
    const { authOptions } = await import('../api/auth/[...nextauth]')
    const session = await getServerSession(ctx.req, ctx.res, authOptions)
    if (!session) return { redirect: { destination: '/admin/login', permanent: false } }

    let posts = []
    try {
      const { listPosts } = await import('../../lib/github')
      posts = await listPosts()
      // Serialize posts to plain objects (avoid Next.js serialization issues)
      posts = JSON.parse(JSON.stringify(posts))
    } catch (e) {
      console.error('Error loading posts:', e)
    }

    return { props: { posts } }
  } catch (e) {
    console.error('Admin SSR error:', e)
    return { redirect: { destination: '/admin/login', permanent: false } }
  }
}
