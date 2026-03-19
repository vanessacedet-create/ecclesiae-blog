import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

const SOCIAL_FIELDS = [
  { key: 'storeUrl', label: 'Link da Loja', placeholder: 'https://www.editoraecclesiae.com.br', icon: '\uD83D\uDED2', hint: 'Usado em todos os bot\u00f5es e CTAs do blog' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/editoraecclesiae', icon: '\uD83D\uDCF7' },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/editoraecclesiae', icon: '\uD83D\uDC4D' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@editoraecclesiae', icon: '\u25B6' },
  { key: 'twitter', label: 'X (Twitter)', placeholder: 'https://x.com/editoraecclesiae', icon: '\uD83D\uDCAC' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@editoraecclesiae', icon: '\uD83C\uDFB5' },
  { key: 'email', label: 'E-mail de Contato', placeholder: 'contato@editoraecclesiae.com.br', icon: '\u2709' },
]

export default function AdminSettings() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState({})
  const [sha, setSha] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status])

  useEffect(() => {
    if (session) fetchSettings()
  }, [session])

  async function fetchSettings() {
    setLoading(true)
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      setSettings(data.settings || {})
      setSha(data.sha)
    } catch (e) {
      console.error('Erro ao carregar:', e)
    }
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings, sha }),
      })
      const data = await res.json()
      if (res.ok) {
        // Update sha from response to prevent conflicts on next save
        if (data.sha) setSha(data.sha)
        if (data.settings) setSettings(data.settings)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        alert('Erro ao salvar: ' + data.error)
      }
    } catch (e) {
      alert('Erro: ' + e.message)
    }
    setSaving(false)
  }

  function set(key, value) {
    setSettings(s => ({ ...s, [key]: value }))
  }

  if (status === 'loading' || !session) return null

  return (
    <>
      <Head>
        <title>{"Configura\u00e7\u00f5es"} &mdash; CMS Ecclesiae</title>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: '100vh', background: '#fffdf7', fontFamily: "'EB Garamond', serif" }}>
        <header style={{ background: '#926d47', borderBottom: '2px solid #f3be4a', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/admin" style={{ color: 'rgba(255,253,247,0.6)', textDecoration: 'none', fontFamily: "'Cinzel', serif", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{'\u2190 Voltar'}</Link>
            <span style={{ color: 'rgba(243,190,74,0.4)' }}>|</span>
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: '12px', color: '#fffdf7', letterSpacing: '0.15em' }}>{'\u2699\uFE0F Configura\u00e7\u00f5es'}</span>
          </div>
          <button onClick={handleSave} disabled={saving} style={{
            background: saving ? 'rgba(243,190,74,0.5)' : '#f3be4a', border: 'none', color: '#1a0f0a',
            fontFamily: "'Cinzel', serif", fontSize: '10px', fontWeight: '600',
            letterSpacing: '0.2em', textTransform: 'uppercase', padding: '8px 20px',
            cursor: saving ? 'not-allowed' : 'pointer',
          }}>
            {saving ? 'Salvando...' : saved ? '\u2713 Salvo!' : 'Salvar'}
          </button>
        </header>

        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ marginBottom: '36px' }}>
            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '24px', fontWeight: '600', color: '#926d47', margin: '0 0 8px' }}>{"Configura\u00e7\u00f5es do Blog"}</h1>
            <p style={{ margin: 0, color: '#888', fontSize: '16px' }}>
              Configure os links da loja, redes sociais e contato. Preencha todos os campos e clique em <strong>Salvar</strong> uma {'\u00fanica'} vez.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <p style={{ fontStyle: 'italic', color: '#888' }}>Carregando...</p>
            </div>
          ) : (
            <>
              {SOCIAL_FIELDS.map((field, index) => (
                <div key={field.key} style={{
                  background: 'white', border: '1px solid rgba(146,109,71,0.12)',
                  borderTop: index === 0 ? '1px solid rgba(146,109,71,0.12)' : 'none',
                  padding: '18px 20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{field.icon}</span>
                    <label style={{ fontFamily: "'Cinzel', serif", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#926d47', fontWeight: '600' }}>{field.label}</label>
                    {field.hint && <span style={{ fontSize: '11px', color: '#bbb', fontStyle: 'italic', marginLeft: 'auto' }}>{field.hint}</span>}
                  </div>
                  <input type="text" value={settings[field.key] || ''} onChange={e => set(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(146,109,71,0.15)', fontFamily: "'EB Garamond', serif", fontSize: '16px', color: '#1A1208', outline: 'none', boxSizing: 'border-box', background: '#fffdf7' }}
                    onFocus={e => e.target.style.borderColor = '#f3be4a'}
                    onBlur={e => e.target.style.borderColor = 'rgba(146,109,71,0.15)'}
                  />
                </div>
              ))}

              <div style={{ marginTop: '24px', padding: '16px 20px', background: 'rgba(243,190,74,0.08)', border: '1px solid rgba(243,190,74,0.2)', fontSize: '14px', color: '#c99a2e', lineHeight: 1.6 }}>
                Preencha todos os campos desejados e clique em <strong>"Salvar"</strong> uma {'\u00fanica'} vez. Todos os links ser\u00e3o salvos juntos. O blog atualiza ap\u00f3s o pr\u00f3ximo deploy.
              </div>
            </>
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
