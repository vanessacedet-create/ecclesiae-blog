import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

export default function AdminLogo() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [logoUrl, setLogoUrl] = useState(null)
  const [sha, setSha] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [previewBase64, setPreviewBase64] = useState(null)
  const [saved, setSaved] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status])

  useEffect(() => {
    if (session) fetchLogo()
  }, [session])

  async function fetchLogo() {
    setLoading(true)
    try {
      const res = await fetch('/api/logo')
      const data = await res.json()
      if (data.exists) {
        setLogoUrl(data.download_url + '?t=' + Date.now())
        setSha(data.sha)
      }
    } catch (e) {
      console.error('Erro ao carregar logo:', e)
    }
    setLoading(false)
  }

  function handleFileSelect(file) {
    if (!file) return
    if (!file.type.includes('png')) {
      alert('Por favor, envie apenas arquivos PNG com fundo transparente.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no m\u00e1ximo 5MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
      // Extract pure base64 (remove data:image/png;base64, prefix)
      const base64 = e.target.result.split(',')[1]
      setPreviewBase64(base64)
    }
    reader.readAsDataURL(file)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  function handleDragOver(e) {
    e.preventDefault()
    setDragOver(true)
  }

  function handleDragLeave(e) {
    e.preventDefault()
    setDragOver(false)
  }

  async function handleUpload() {
    if (!previewBase64) return
    setUploading(true)
    try {
      const res = await fetch('/api/logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Content: previewBase64, sha }),
      })
      const data = await res.json()
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
        setPreview(null)
        setPreviewBase64(null)
        await fetchLogo()
      } else {
        alert('Erro ao salvar: ' + data.error)
      }
    } catch (e) {
      alert('Erro ao salvar: ' + e.message)
    }
    setUploading(false)
  }

  async function handleDelete() {
    if (!sha) return
    if (!confirm('Tem certeza que deseja remover a logo?')) return
    setUploading(true)
    try {
      const res = await fetch('/api/logo', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sha }),
      })
      if (res.ok) {
        setLogoUrl(null)
        setSha(null)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        const data = await res.json()
        alert('Erro ao remover: ' + data.error)
      }
    } catch (e) {
      alert('Erro ao remover: ' + e.message)
    }
    setUploading(false)
  }

  function cancelPreview() {
    setPreview(null)
    setPreviewBase64(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (status === 'loading' || !session) return null

  return (
    <>
      <Head>
        <title>Logo do Blog &mdash; CMS Ecclesiae</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap"
          rel="stylesheet"
        />
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/admin" style={{
              color: 'rgba(250,247,242,0.6)',
              textDecoration: 'none',
              fontFamily: "'Cinzel', serif",
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}>
              {'\u2190 Voltar'}
            </Link>
            <span style={{ color: 'rgba(184,148,63,0.4)' }}>|</span>
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '12px',
              color: '#fffdf7',
              letterSpacing: '0.15em',
            }}>
              {'\U0001f3a8'} Logo do Blog
            </span>
          </div>
          {saved && (
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '11px',
              color: '#f3be4a',
              letterSpacing: '0.1em',
            }}>
              {'\u2713'} Salvo com sucesso!
            </span>
          )}
        </header>

        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 24px' }}>

          {/* Page title */}
          <div style={{ marginBottom: '36px' }}>
            <h1 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '24px',
              fontWeight: '600',
              color: '#926d47',
              margin: '0 0 8px',
            }}>
              Logo do Blog
            </h1>
            <p style={{
              margin: 0,
              color: '#888',
              fontStyle: 'italic',
              fontSize: '16px',
            }}>
              Envie uma imagem PNG com fundo transparente. Ela aparecer\u00e1 no cabe\u00e7alho do blog.
            </p>
          </div>

          {/* Current logo */}
          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              color: '#f3be4a',
            }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{'\u2720'}</div>
              <p style={{ fontStyle: 'italic', color: '#888' }}>Carregando...</p>
            </div>
          ) : (
            <>
              {/* Logo atual */}
              {logoUrl && !preview && (
                <div style={{
                  background: 'white',
                  border: '1px solid rgba(92,30,30,0.12)',
                  padding: '24px',
                  marginBottom: '24px',
                }}>
                  <label style={{
                    display: 'block',
                    fontFamily: "'Cinzel', serif",
                    fontSize: '10px',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: '#f3be4a',
                    marginBottom: '16px',
                  }}>
                    Logo Atual
                  </label>
                  <div style={{
                    background: 'repeating-conic-gradient(#f0f0f0 0% 25%, white 0% 50%) 50% / 20px 20px',
                    padding: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(92,30,30,0.08)',
                    marginBottom: '16px',
                  }}>
                    <img
                      src={logoUrl}
                      alt="Logo atual"
                      style={{ maxHeight: '80px', maxWidth: '100%' }}
                    />
                  </div>
                  <button
                    onClick={handleDelete}
                    disabled={uploading}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(198,40,40,0.3)',
                      color: '#c62828',
                      fontFamily: "'Cinzel', serif",
                      fontSize: '10px',
                      fontWeight: '600',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      padding: '8px 16px',
                      cursor: uploading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Remover Logo
                  </button>
                </div>
              )}

              {/* Preview da nova logo */}
              {preview && (
                <div style={{
                  background: 'white',
                  border: '2px solid #f3be4a',
                  padding: '24px',
                  marginBottom: '24px',
                }}>
                  <label style={{
                    display: 'block',
                    fontFamily: "'Cinzel', serif",
                    fontSize: '10px',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: '#f3be4a',
                    marginBottom: '16px',
                  }}>
                    Pr\u00e9-visualiza\u00e7\u00e3o
                  </label>
                  <div style={{
                    background: 'repeating-conic-gradient(#f0f0f0 0% 25%, white 0% 50%) 50% / 20px 20px',
                    padding: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(92,30,30,0.08)',
                    marginBottom: '16px',
                  }}>
                    <img
                      src={preview}
                      alt="Preview da logo"
                      style={{ maxHeight: '80px', maxWidth: '100%' }}
                    />
                  </div>

                  {/* Preview in header mockup */}
                  <label style={{
                    display: 'block',
                    fontFamily: "'Cinzel', serif",
                    fontSize: '10px',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: '#f3be4a',
                    marginBottom: '12px',
                  }}>
                    Como fica no blog
                  </label>
                  <div style={{
                    background: 'white',
                    border: '1px solid #e5e5e5',
                    padding: '16px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '32px',
                    marginBottom: '20px',
                    overflow: 'hidden',
                  }}>
                    <img
                      src={preview}
                      alt="Preview no header"
                      style={{ height: '40px', width: 'auto' }}
                    />
                    <div style={{
                      display: 'flex',
                      gap: '24px',
                      fontFamily: "'Cinzel', serif",
                      fontSize: '9px',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: '#999',
                    }}>
                      <span>{'In\u00edcio'}</span>
                      <span>Categorias</span>
                      <span>Sobre</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      style={{
                        background: uploading ? 'rgba(184,148,63,0.5)' : '#f3be4a',
                        border: 'none',
                        color: '#1a0f0a',
                        fontFamily: "'Cinzel', serif",
                        fontSize: '10px',
                        fontWeight: '600',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        padding: '10px 24px',
                        cursor: uploading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {uploading ? 'Enviando...' : 'Salvar Logo'}
                    </button>
                    <button
                      onClick={cancelPreview}
                      disabled={uploading}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(92,30,30,0.2)',
                        color: '#926d47',
                        fontFamily: "'Cinzel', serif",
                        fontSize: '10px',
                        fontWeight: '600',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        padding: '10px 20px',
                        cursor: 'pointer',
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Upload area */}
              {!preview && (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    background: dragOver ? 'rgba(184,148,63,0.08)' : 'white',
                    border: dragOver
                      ? '2px dashed #f3be4a'
                      : '2px dashed rgba(92,30,30,0.15)',
                    padding: '48px 24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    marginBottom: '24px',
                  }}
                >
                  <div style={{
                    fontSize: '36px',
                    marginBottom: '12px',
                    color: dragOver ? '#f3be4a' : '#ccc',
                  }}>
                    {'\u2191'}
                  </div>
                  <p style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '13px',
                    fontWeight: '600',
                    letterSpacing: '0.1em',
                    color: '#926d47',
                    margin: '0 0 6px',
                  }}>
                    {logoUrl ? 'Trocar Logo' : 'Enviar Logo'}
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#999',
                    fontStyle: 'italic',
                    margin: 0,
                  }}>
                    Arraste uma imagem PNG aqui ou clique para selecionar
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: '#bbb',
                    margin: '8px 0 0',
                  }}>
                    {'M\u00e1ximo 5MB \u00b7 Formato PNG com fundo transparente'}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                  />
                </div>
              )}

              {/* Info box */}
              <div style={{
                padding: '16px 20px',
                background: 'rgba(184,148,63,0.08)',
                border: '1px solid rgba(184,148,63,0.2)',
                fontSize: '14px',
                color: '#c99a2e',
                fontStyle: 'italic',
                lineHeight: 1.6,
              }}>
                {'\u2720'} A logo aparece no cabe\u00e7alho de todas as p\u00e1ginas do blog. Use uma imagem PNG com fundo transparente para melhor resultado. O blog atualiza automaticamente ap\u00f3s o deploy.
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
