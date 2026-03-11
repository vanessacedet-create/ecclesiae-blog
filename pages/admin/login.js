import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', {
      password,
      redirect: false,
    })
    setLoading(false)
    if (result?.ok) {
      router.push('/admin')
    } else {
      setError('Senha incorreta. Tente novamente.')
    }
  }

  return (
    <>
      <Head>
        <title>Acesso — CMS Ecclesiae</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=EB+Garamond:ital,wght@0,400;1,400&display=swap" rel="stylesheet" />
      </Head>
      <div style={{
        minHeight: '100vh',
        background: '#1a0f0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'EB Garamond', serif",
        backgroundImage: `radial-gradient(ellipse at center, #2d1810 0%, #1a0f0a 70%)`,
      }}>
        {/* Decorative cross pattern */}
        <div style={{
          position: 'fixed', inset: 0, opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B8943F'%3E%3Crect x='26' y='8' width='8' height='44'/%3E%3Crect x='8' y='26' width='44' height='8'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '400px',
          padding: '0 24px',
        }}>
          {/* Logo area */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ color: '#B8943F', fontSize: '36px', marginBottom: '16px', letterSpacing: '8px' }}>
              ✠
            </div>
            <h1 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '22px',
              fontWeight: '600',
              color: '#FAF7F2',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              margin: '0 0 8px',
            }}>
              Editora Ecclesiae
            </h1>
            <p style={{
              fontFamily: "'EB Garamond', serif",
              fontStyle: 'italic',
              color: '#B8943F',
              fontSize: '16px',
              margin: 0,
            }}>
              Painel de Administração
            </p>
          </div>

          {/* Form card */}
          <div style={{
            background: 'rgba(250,247,242,0.04)',
            border: '1px solid rgba(184,148,63,0.25)',
            padding: '40px 36px',
          }}>
            <form onSubmit={handleSubmit}>
              <label style={{
                display: 'block',
                fontFamily: "'Cinzel', serif",
                fontSize: '10px',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#B8943F',
                marginBottom: '10px',
              }}>
                Senha de Acesso
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(184,148,63,0.3)',
                  color: '#FAF7F2',
                  fontSize: '18px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: "'EB Garamond', serif",
                  letterSpacing: '0.2em',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#B8943F'}
                onBlur={e => e.target.style.borderColor = 'rgba(184,148,63,0.3)'}
              />

              {error && (
                <p style={{
                  color: '#e57373',
                  fontStyle: 'italic',
                  fontSize: '14px',
                  margin: '12px 0 0',
                }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  marginTop: '24px',
                  padding: '14px',
                  background: loading ? 'rgba(184,148,63,0.4)' : '#B8943F',
                  border: 'none',
                  color: '#1a0f0a',
                  fontFamily: "'Cinzel', serif",
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                {loading ? 'Entrando...' : 'Entrar no Painel'}
              </button>
            </form>
          </div>

          <p style={{
            textAlign: 'center',
            marginTop: '24px',
            fontStyle: 'italic',
            color: 'rgba(250,247,242,0.25)',
            fontSize: '13px',
          }}>
            ✦ Ad Maiorem Dei Gloriam ✦
          </p>
        </div>
      </div>
    </>
  )
}
