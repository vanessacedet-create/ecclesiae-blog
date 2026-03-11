import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import RichEditor from './RichEditor'

const CATEGORIES = ['Liturgia', 'Teologia', 'Espiritualidade', 'Santos', 'Filosofia', 'Cultura', 'Vida Cristã', 'Outro']

function slugify(text) {
  return text.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-')
}

export default function PostEditor({ initialData, sha, isEditing }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null) // 'saved', 'error', 'saving'
  const [activeTab, setActiveTab] = useState('conteudo')
  const autoSaveRef = useRef(null)

  const [form, setForm] = useState({
    title: '', date: new Date().toISOString().split('T')[0],
    category: '', author: '', excerpt: '', slug: '',
    status: 'draft', metaTitle: '', metaDescription: '',
    tags: '', scheduledAt: '', body: '',
    ...initialData,
  })

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditing && form.title && !form.slugEdited) {
      setForm(f => ({ ...f, slug: slugify(f.title) }))
    }
  }, [form.title])

  // Auto-save every 60s
  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      if (form.title && form.body) {
        handleSave('draft', true)
      }
    }, 60000)
    return () => clearInterval(autoSaveRef.current)
  }, [form])

  function set(key, value) {
    setForm(f => ({ ...f, [key]: value }))
  }

  const titleLength = form.title.length
  const metaDescLength = form.metaDescription.length

  async function handleSave(statusOverride, isAutoSave = false) {
    if (!form.title) { alert('O título é obrigatório.'); return }
    if (!form.body) { alert('O conteúdo é obrigatório.'); return }

    setSaving(true)
    setSaveStatus('saving')

    const tagsArray = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []

    const res = await fetch('/api/github/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        status: statusOverride || form.status,
        tags: tagsArray,
        sha,
      }),
    })

    setSaving(false)

    if (res.ok) {
      setSaveStatus('saved')
      if (!isAutoSave && !isEditing) {
        router.push('/admin')
      }
      setTimeout(() => setSaveStatus(null), 3000)
    } else {
      setSaveStatus('error')
      const data = await res.json()
      alert('Erro ao salvar: ' + (data.error || 'Tente novamente'))
    }
  }

  const tabStyle = (tab) => ({
    fontFamily: "'Cinzel', serif",
    fontSize: '10px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    padding: '10px 20px',
    cursor: 'pointer',
    border: 'none',
    background: activeTab === tab ? 'white' : 'transparent',
    color: activeTab === tab ? '#5C1E1E' : '#999',
    borderBottom: activeTab === tab ? '2px solid #5C1E1E' : '2px solid transparent',
    transition: 'all 0.15s',
  })

  return (
    <>
      <Head>
        <title>{isEditing ? 'Editar Post' : 'Novo Post'} — CMS Ecclesiae</title>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/admin" style={{
              color: 'rgba(250,247,242,0.6)',
              textDecoration: 'none',
              fontFamily: "'Cinzel', serif",
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}>
              ← Voltar
            </Link>
            <span style={{ color: 'rgba(184,148,63,0.4)' }}>|</span>
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '12px',
              color: '#FAF7F2',
              letterSpacing: '0.15em',
            }}>
              {isEditing ? 'Editar Post' : 'Novo Post'}
            </span>
          </div>

          {/* Save status + actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {saveStatus === 'saved' && (
              <span style={{ color: '#4caf50', fontStyle: 'italic', fontSize: '14px' }}>✓ Salvo</span>
            )}
            {saveStatus === 'saving' && (
              <span style={{ color: '#B8943F', fontStyle: 'italic', fontSize: '14px' }}>Salvando...</span>
            )}

            <button
              onClick={() => handleSave('draft')}
              disabled={saving}
              style={{
                background: 'transparent',
                border: '1px solid rgba(184,148,63,0.5)',
                color: '#B8943F',
                fontFamily: "'Cinzel', serif",
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                padding: '8px 18px',
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              Rascunho
            </button>

            <button
              onClick={() => handleSave('published')}
              disabled={saving}
              style={{
                background: saving ? 'rgba(184,148,63,0.5)' : '#B8943F',
                border: 'none',
                color: '#1a0f0a',
                fontFamily: "'Cinzel', serif",
                fontSize: '10px',
                fontWeight: '600',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                padding: '8px 18px',
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? 'Salvando...' : 'Publicar'}
            </button>
          </div>
        </header>

        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>

          {/* Title */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontFamily: "'Cinzel', serif", fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B8943F' }}>
                Título do Post *
              </label>
              <span style={{ fontSize: '12px', color: titleLength > 65 ? '#e57373' : '#aaa' }}>
                {titleLength}/70 caracteres
              </span>
            </div>
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Escreva um título claro e envolvente..."
              maxLength={100}
              style={{
                width: '100%',
                padding: '16px 20px',
                border: '1px solid rgba(92,30,30,0.2)',
                background: 'white',
                fontFamily: "'Playfair Display', 'EB Garamond', serif",
                fontSize: '26px',
                color: '#1A1208',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid rgba(92,30,30,0.15)',
            marginBottom: '24px',
            marginTop: '24px',
          }}>
            {[
              { id: 'conteudo', label: 'Conteúdo' },
              { id: 'metadados', label: 'Metadados' },
              { id: 'seo', label: 'SEO' },
              { id: 'publicacao', label: 'Publicação' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={tabStyle(tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab: Conteúdo */}
          {activeTab === 'conteudo' && (
            <RichEditor value={form.body} onChange={v => set('body', v)} />
          )}

          {/* Tab: Metadados */}
          {activeTab === 'metadados' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {[
                { key: 'author', label: 'Autor', placeholder: 'Ex: Pe. João Silva', full: false },
                { key: 'date', label: 'Data de Publicação', type: 'date', full: false },
              ].map(field => (
                <Field key={field.key} label={field.label}>
                  <input
                    type={field.type || 'text'}
                    value={form[field.key]}
                    onChange={e => set(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    style={inputStyle}
                  />
                </Field>
              ))}

              <Field label="Categoria">
                <select value={form.category} onChange={e => set('category', e.target.value)} style={inputStyle}>
                  <option value="">Selecione...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>

              <Field label="Tags" hint="Separadas por vírgula">
                <input
                  type="text"
                  value={form.tags}
                  onChange={e => set('tags', e.target.value)}
                  placeholder="Ex: liturgia, tradição, missa"
                  style={inputStyle}
                />
              </Field>

              <Field label="Slug (URL)" hint={`seusite.com/posts/${form.slug || 'meu-post'}`} fullWidth>
                <input
                  type="text"
                  value={form.slug}
                  onChange={e => set('slug', e.target.value) || set('slugEdited', true)}
                  placeholder="meu-artigo-aqui"
                  style={inputStyle}
                />
              </Field>

              <Field label="Resumo (Excerpt)" hint="2-3 linhas para aparecer na listagem do blog" fullWidth>
                <textarea
                  value={form.excerpt}
                  onChange={e => set('excerpt', e.target.value)}
                  placeholder="Um resumo atraente do artigo..."
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </Field>
            </div>
          )}

          {/* Tab: SEO */}
          {activeTab === 'seo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                padding: '20px 24px',
                background: 'white',
                border: '1px solid rgba(92,30,30,0.1)',
                marginBottom: '8px',
              }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: '10px', letterSpacing: '0.2em', color: '#B8943F', marginBottom: '12px', textTransform: 'uppercase' }}>
                  Pré-visualização no Google
                </p>
                <div style={{ fontFamily: 'Arial, sans-serif' }}>
                  <div style={{ color: '#1a0dab', fontSize: '18px', marginBottom: '4px' }}>
                    {form.metaTitle || form.title || 'Título do artigo'}
                  </div>
                  <div style={{ color: '#006621', fontSize: '13px', marginBottom: '4px' }}>
                    seusite.com/posts/{form.slug || 'slug-do-post'}
                  </div>
                  <div style={{ color: '#545454', fontSize: '13px', lineHeight: '1.5' }}>
                    {form.metaDescription || form.excerpt || 'Descrição do artigo para os motores de busca...'}
                  </div>
                </div>
              </div>

              <Field label="Meta Title" hint={`${(form.metaTitle || form.title).length}/60 — se vazio, usa o título do post`}>
                <input type="text" value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)}
                  placeholder={form.title || 'Título para o Google'} maxLength={65} style={inputStyle} />
              </Field>

              <Field label="Meta Description" hint={`${metaDescLength}/160 caracteres`}>
                <textarea value={form.metaDescription} onChange={e => set('metaDescription', e.target.value)}
                  placeholder="Descrição de 150-160 caracteres para aparecer no Google..." maxLength={165}
                  rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </Field>
            </div>
          )}

          {/* Tab: Publicação */}
          {activeTab === 'publicacao' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <Field label="Status do Post">
                <select value={form.status} onChange={e => set('status', e.target.value)} style={inputStyle}>
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                  <option value="scheduled">Agendado</option>
                </select>
              </Field>

              {form.status === 'scheduled' && (
                <Field label="Data e Hora de Publicação">
                  <input type="datetime-local" value={form.scheduledAt}
                    onChange={e => set('scheduledAt', e.target.value)} style={inputStyle} />
                </Field>
              )}

              <div style={{
                gridColumn: '1 / -1',
                padding: '20px 24px',
                background: 'white',
                border: '1px solid rgba(92,30,30,0.1)',
                marginTop: '8px',
              }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: '10px', letterSpacing: '0.2em', color: '#B8943F', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Resumo
                </p>
                <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 24px', fontSize: '15px' }}>
                  {[
                    ['Título', form.title || '—'],
                    ['Categoria', form.category || '—'],
                    ['Autor', form.author || '—'],
                    ['Status', form.status],
                    ['Data', form.date],
                    ['Slug', form.slug || slugify(form.title) || '—'],
                  ].map(([k, v]) => (
                    <>
                      <dt key={k} style={{ color: '#aaa', fontFamily: "'Cinzel', serif", fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', paddingTop: '4px' }}>{k}</dt>
                      <dd key={v} style={{ margin: 0, color: '#1A1208' }}>{v}</dd>
                    </>
                  ))}
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid rgba(92,30,30,0.2)',
  background: 'white',
  fontFamily: "'EB Garamond', serif",
  fontSize: '16px',
  color: '#1A1208',
  outline: 'none',
  boxSizing: 'border-box',
}

function Field({ label, hint, children, fullWidth }) {
  return (
    <div style={{ gridColumn: fullWidth ? '1 / -1' : 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'baseline' }}>
        <label style={{ fontFamily: "'Cinzel', serif", fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B8943F' }}>
          {label}
        </label>
        {hint && <span style={{ fontSize: '12px', color: '#aaa', fontStyle: 'italic' }}>{hint}</span>}
      </div>
      {children}
    </div>
  )
}
