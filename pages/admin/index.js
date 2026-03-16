import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status])

  if (status === 'loading' || !session) return null

  return (
    <>
      <Head>
        <title>Painel Admin &mdash; CMS Ecclesiae</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div style={{ minHeight: '100vh', background: '#FAF7F2', fontFamily: "'EB Garamond', serif" }}>

        {/* Header */}
        <header style={{
          background: '#5C1E1E',
          borderBottom: '2px solid #B8943F',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '14px',
              fontWeight: '600',
              color: '#FAF7F2',
              letterSpacing: '0.15em',
            }}>
              {"\u2720"} CMS Ecclesiae
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{
              fontSize: '13px',
              color: 'rgba(250,247,242,0.6)',
              fontStyle: 'italic',
            }}>
              {session.user?.name || session.user?.email || 'Admin'}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              style={{
                background: 'transparent',
                border: '1px solid rgba(184,148,63,0.4)',
                color: '#B8943F',
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

        {/* Content */}
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>

          {/* Welcome */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '32px', color: '#B8943F', marginBottom: '12px' }}>{"\u2720"}</div>
            <h1 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '28px',
              fontWeight: '600',
              color: '#5C1E1E',
              margin: '0 0 8px',
            }}>
              Painel Administrativo
            </h1>
            <p style={{
              margin: 0,
              color: '#888',
              fontStyle: 'italic',
              fontSize: '16px',
            }}>
              Gerencie o blog da Editora Ecclesiae
            </p>
          </div>

          {/* Action cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '48px',
          }}>

            {/* Novo Post */}
            <Link href="/admin/novo" style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#5C1E1E',
                padding: '28px 24px',
                cursor: 'pointer',
                transition: 'transform 0.15s',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{"\u270E"}</div>
                <p style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '13px',
                  fontWeight: '600',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#FAF7F2',
                  margin: '0 0 6px',
                }}>
                  Novo Artigo
                </p>
                <p style={{
                  fontSize: '13px',
                  color: 'rgba(250,247,242,0.5)',
                  fontStyle: 'italic',
                  margin: 0,
                }}>
                  Escrever e publicar um novo post
                </p>
              </div>
            </Link>

            {/* Categorias */}
            <Link href="/admin/categorias" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                border: '1px solid rgba(92,30,30,0.12)',
                padding: '28px 24px',
                cursor: 'pointer',
                transition: 'transform 0.15s',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{"\u2630"}</div>
                <p style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '13px',
                  fontWeight: '600',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#5C1E1E',
                  margin: '0 0 6px',
                }}>
                  Categorias
                </p>
                <p style={{
                  fontSize: '13px',
                  color: '#999',
                  fontStyle: 'italic',
                  margin: 0,
                }}>
                  Gerenciar categorias do blog
                </p>
              </div>
            </Link>

            {/* Ver Blog */}
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                border: '1px solid rgba(92,30,30,0.12)',
                padding: '28px 24px',
                cursor: 'pointer',
                transition: 'transform 0.15s',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{"\u{1F310}"}</div>
                <p style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '13px',
                  fontWeight: '600',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#5C1E1E',
                  margin: '0 0 6px',
                }}>
                  Ver Blog
                </p>
                <p style={{
                  fontSize: '13px',
                  color: '#999',
                  fontStyle: 'italic',
                  margin: 0,
                }}>
                  Abrir o blog como visitante
                </p>
              </div>
            </Link>

          </div>

          {/* Info box */}
          <div style={{
            padding: '16px 20px',
            background: 'rgba(184,148,63,0.08)',
            border: '1px solid rgba(184,148,63,0.2)',
            fontSize: '14px',
            color: '#8B6914',
            fontStyle: 'italic',
            lineHeight: 1.6,
            textAlign: 'center',
          }}>
            {"\u2720"} Use o menu acima para criar artigos, gerenciar categorias ou visualizar o blog.
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
