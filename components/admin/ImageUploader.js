import { useState, useRef } from 'react'

export default function ImageUploader({ onInsert, onClose }) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [altText, setAltText] = useState('')
  const [preview, setPreview] = useState(null)
  const [uploadedUrl, setUploadedUrl] = useState(null)
  const fileInputRef = useRef(null)

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) processFile(file)
  }

  function processFile(file) {
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione apenas imagens (JPG, PNG, WebP, etc.)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('A imagem deve ter no m\u00e1ximo 10MB.')
      return
    }
    setError('')
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
    if (!altText) setAltText(nameWithoutExt)
  }

  async function handleUpload() {
    if (!preview) return
    setUploading(true)
    setError('')
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: preview,
          filename: altText ? altText.replace(/\s+/g, '-').toLowerCase() : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Erro ao fazer upload. Verifique se o Cloudinary est\u00e1 configurado.')
        setUploading(false)
        return
      }
      setUploadedUrl(data.url)
      setUploading(false)
    } catch (e) {
      setError('Erro de conex\u00e3o. Tente novamente.')
      setUploading(false)
    }
  }

  function handleInsert() {
    if (!uploadedUrl) return
    const markdown = `![${altText || 'imagem'}](${uploadedUrl})`
    onInsert(markdown)
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(26,15,10,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: '#fffdf7', width: '100%', maxWidth: '520px', fontFamily: "'EB Garamond', serif" }}>

        {/* Header */}
        <div style={{
          background: '#926d47', padding: '16px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#fffdf7' }}>
            Inserir Imagem
          </span>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,253,247,0.5)', cursor: 'pointer', fontSize: '18px' }}>{'\u2715'}</button>
        </div>

        <div style={{ padding: '28px 28px 24px' }}>

          {/* Drop zone */}
          {!preview && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragging ? '#f3be4a' : 'rgba(146,109,71,0.25)'}`,
                background: dragging ? 'rgba(243,190,74,0.05)' : 'white',
                padding: '48px 24px', textAlign: 'center',
                cursor: 'pointer', transition: 'all 0.2s', marginBottom: '20px',
              }}
            >
              <div style={{ fontSize: '40px', color: 'rgba(243,190,74,0.4)', marginBottom: '12px' }}>{'\uD83D\uDDBC'}</div>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#926d47', margin: '0 0 6px' }}>
                Arraste uma imagem aqui
              </p>
              <p style={{ margin: 0, fontSize: '14px', color: '#aaa', fontStyle: 'italic' }}>
                ou clique para selecionar {'\u00b7'} JPG, PNG, WebP {'\u00b7'} at\u00e9 10MB
              </p>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </div>
          )}

          {/* Preview */}
          {preview && !uploadedUrl && (
            <div style={{ marginBottom: '20px', position: 'relative' }}>
              <img src={preview} alt="preview" style={{ width: '100%', maxHeight: '240px', objectFit: 'cover', display: 'block' }} />
              <button onClick={() => { setPreview(null); setAltText('') }}
                style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(26,15,10,0.7)', border: 'none', color: 'white', width: '28px', height: '28px', cursor: 'pointer', fontSize: '14px' }}>{'\u2715'}</button>
            </div>
          )}

          {/* Uploaded success */}
          {uploadedUrl && (
            <div style={{ marginBottom: '20px' }}>
              <img src={uploadedUrl} alt={altText} style={{ width: '100%', maxHeight: '240px', objectFit: 'cover', display: 'block' }} />
              <div style={{ background: '#e8f5e9', padding: '8px 12px', fontSize: '13px', color: '#2e7d32', fontStyle: 'italic' }}>
                {'\u2713'} Imagem enviada com sucesso!
              </div>
            </div>
          )}

          {/* Alt text */}
          {preview && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#f3be4a', marginBottom: '6px' }}>
                Texto alternativo
                <span style={{ fontFamily: "'EB Garamond', serif", textTransform: 'none', letterSpacing: 0, color: '#aaa', fontSize: '12px', marginLeft: '8px' }}>
                  {'\u2014'} descreve a imagem para acessibilidade e SEO
                </span>
              </label>
              <input type="text" value={altText} onChange={e => setAltText(e.target.value)}
                placeholder="Ex: S\u00e3o Tom\u00e1s de Aquino com livros"
                style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(146,109,71,0.2)', fontFamily: "'EB Garamond', serif", fontSize: '16px', color: '#1A1208', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          )}

          {/* Error */}
          {error && (
            <p style={{ color: '#c62828', fontStyle: 'italic', fontSize: '14px', margin: '0 0 16px' }}>{error}</p>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{
              background: 'transparent', border: '1px solid rgba(146,109,71,0.25)', color: '#926d47',
              padding: '10px 20px', fontFamily: "'Cinzel', serif", fontSize: '10px',
              letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer',
            }}>Cancelar</button>

            {preview && !uploadedUrl && (
              <button onClick={handleUpload} disabled={uploading} style={{
                background: uploading ? 'rgba(243,190,74,0.5)' : '#f3be4a',
                border: 'none', color: '#1a0f0a', padding: '10px 24px',
                fontFamily: "'Cinzel', serif", fontSize: '10px', fontWeight: '600',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                cursor: uploading ? 'not-allowed' : 'pointer',
              }}>{uploading ? 'Enviando...' : 'Enviar Imagem'}</button>
            )}

            {uploadedUrl && (
              <button onClick={handleInsert} style={{
                background: '#926d47', border: 'none', color: '#fffdf7',
                padding: '10px 24px', fontFamily: "'Cinzel', serif", fontSize: '10px',
                fontWeight: '600', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer',
              }}>Inserir no Post</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
