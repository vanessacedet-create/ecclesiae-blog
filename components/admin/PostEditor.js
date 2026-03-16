import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import RichEditor from './RichEditor'

function slugify(text) {
  return text.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-')
}

export default function PostEditor({ initialData, sha, isEditing }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)
  const [activeTab, setActiveTab] = useState('conteudo')
  const [categorias, setCategorias] = useState([])
  const [loadingCats, setLoadingCats] = useState(true)
  const autoSaveRef = useRef(null)

  // Parse initial categories — support both string and array
  function parseInitialCategories(data) {
    if (!data) return []
    if (Array.isArray(data)) return data
    if (typeof data === 'string' && data.trim()) {
      return data.split(',').map(c => c.trim()).filter(Boolean)
    }
    return []
  }

  const [form, setForm] = useState({
    title: '', date: new Date().toISOString().split('T')[0],
    categories: [], author: '', excerpt: '', slug: '',
    status: 'draft', metaTitle: '', metaDescription: '',
    tags: '', scheduledAt: '', body: '', coverImage: '',
    ...initialData,
    categories: parseInitialCategories(initialData?.categories || initialData?.category),
  })

  // Fetch dynamic categories from API
  useEffect(() => {
    async function fetchCats() {
      try {
        const res = await fetch('/api/categorias')
        const data = await res.json()
        setCategorias(data.categorias || [])
      } catch (e) {
        console.error('Erro ao carregar categorias:', e)
      }
      setLoadingCats(false)
    }
    fetchCats()
  }, [])

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

  function toggleCategory(catLabel) {
    setForm(f => {
      const current = f.categories || []
      if (current.includes(catLabel)) {
        return { ...f, categories: current.filter(c => c !== catLabel) }
      } else {
        return { ...f, categories: [...current, catLabel] }
      }
    })
  }

  const titleLength = form.title.length
  const metaDescLength = form.metaDescription.length

  async function handleSave(statusOverride, isAutoSave = false) {
    if (!form.title) { alert('O t\u00edtulo \u00e9 obrigat\u00f3rio.'); return }
    if (!form.body) { alert('O conte\u00fado \u00e9 obrigat\u00f3rio.'); return }

    setSaving(true)
    setSaveStatus('saving')

    const tagsArray = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []

    const res = await fetch('/api/github/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        // Send categories as array
        categories: form.categories || [],
        // Keep backwards compat: first category as "category"
        category: (form.categories && form.categories.length > 0) ? form.categories[0] : '',
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
    color: activeTab === tab ? '#926d47' : '#999',
    borderBottom: activeTab === tab ? '2px solid #926d47' : '2px solid transparent',
    transition: 'all 0.15s',
  })

  return (
    <>
      <Head>
        <title>{isEditing ? 'Editar Post' : 'Novo Post'} &mdash; CMS Ecclesiae</title>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/admin" style={{
              color: 'rgba(255,253,247,0.6)',
              textDecoration: 'none',
              fontFamily: "'Cinzel', serif",
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}>
              {'\u2190 Voltar'}
            </Link>
            <span style={{ color: 'rgba(243,190,74,0.4)' }}>|</span>
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '12px',
              color: '#fffdf7',
              letterSpacing: '0.15em',
            }}>
              {isEditing ? 'Editar Post' : 'Novo Post'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {saveStatus === 'saved' && (
              <span style={{ color: '#4caf50', fontStyle: 'italic', fontSize: '14px' }}>{'\u2713 Salvo'}</span>
            )}
            {saveStatus === 'saving' && (
              <span style={{ color: '#f3be4a', fontStyle: 'italic', fontSize: '14px' }}>Salvando...</span>
            )}

            <button
              onClick={() => handleSave('draft')}
              disabled={saving}
              style={{
                background: 'transparent',
                border: '1px solid rgba(243,190,74,0.5)',
                color: '#f3be4a',
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
                background: saving ? 'rgba(243,190,74,0.5)' : '#f3be4a',
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
              <label style={{ fontFamily: "'Cinzel', serif", fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#f3be4a' }}>
                {'T\u00edtulo do Post *'}
              </label>
              <span style={{ fontSize: '12px', color: titleLength > 65 ? '#e57373' : '#aaa' }}>
                {titleLength}/70 caracteres
              </span>
            </div>
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Escreva um t\u00edtulo claro e envolvente..."
              maxLength={100}
              style={{
                width: '100%',
                padding: '16px 20px',
                border: '1px solid rgba(146,109,71,0.2)',
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
            borderBottom: '1px solid rgba(146,109,71,0.15)',
            marginBottom: '24px',
            marginTop: '24px',
          }}>
            {[
              { id: 'conteudo', label: 'Conte\u00fado' },
              { id: 'metadados', label: 'Metadados' },
              { id: 'seo', label: 'SEO' },
              { id: 'publicacao', label: 'Publica\u00e7\u00e3o' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={tabStyle(tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab: Conteudo */}
          {activeTab === 'conteudo' && (
            <RichEditor value={form.body} onChange={v => set('body', v)} />
          )}

          {/* Tab: Metadados */}
          {activeTab === 'metadados' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {[
                { key: 'author', label: 'Autor', placeholder: 'Ex: Pe. Jo\u00e3o Silva' },
                { key: 'date', label: 'Data de Publica\u00e7\u00e3o', type: 'date' },
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

              {/* Multi-category selection */}
              <Field label="Categorias" hint="Selecione uma ou mais" fullWidth>
                {loadingCats ? (
                  <p style={{ color: '#aaa', fontStyle: 'italic', fontSize: '14px' }}>Carregando categorias...</p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {categorias.map(cat => {
                      const isSelected = (form.categories || []).includes(cat.label)
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategory(cat.label)}
                          style={{
                            padding: '8px 16px',
                            border: isSelected ? '2px solid #926d47' : '1px solid rgba(146,109,71,0.25)',
                            background: isSelected ? '#926d47' : 'white',
                            color: isSelected ? '#fffdf7' : '#926d47',
                            fontFamily: "'Cinzel', serif",
                            fontSize: '11px',
                            fontWeight: isSelected ? '600' : '400',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                        >
                          {isSelected ? '\u2713 ' : ''}{cat.label}
                        </button>
                      )
                    })}
                    {categorias.length === 0 && (
                      <p style={{ color: '#aaa', fontStyle: 'italic', fontSize: '14px' }}>
                        Nenhuma categoria cadastrada.{' '}
                        <Link href="/admin/categorias" style={{ color: '#926d47' }}>Criar categorias</Link>
                      </p>
                    )}
                  </div>
                )}
                {(form.categories || []).length > 0 && (
                  <div style={{ marginTop: '10px', fontSize: '13px', color: '#999', fontStyle: 'italic' }}>
                    Selecionadas: {form.categories.join(', ')}
                  </div>
                )}
              </Field>

              <Field label="Imagem de Capa (URL)" hint="URL da imagem para o topo do artigo" fullWidth>
                <input
                  type="text"
                  value={form.coverImage || ''}
                  onChange={e => set('coverImage', e.target.value)}
                  placeholder="Ex: /images/minha-imagem.jpg ou https://..."
                  style={inputStyle}
                />
                {form.coverImage && (
                  <div style={{
                    marginTop: '10px',
                    background: 'repeating-conic-gradient(#f0f0f0 0% 25%, white 0% 50%) 50% / 20px 20px',
                    padding: '12px',
                    border: '1px solid rgba(146,109,71,0.1)',
                  }}>
                    <img src={form.coverImage} alt="Preview" style={{ maxHeight: '120px', maxWidth: '100%' }}
                      onError={e => e.target.style.display = 'none'} />
                  </div>
                )}
              </Field>

              <Field label="Tags" hint="Separadas por v\u00edrgula" fullWidth>
                <input
                  type="text"
                  value={form.tags}
                  onChange={e => set('tags', e.target.value)}
                  placeholder="Ex: liturgia, tradi\u00e7\u00e3o, missa"
                  style={inputStyle}
                />
              </Field>

              <Field label="Slug (URL)" hint={`seusite.com/posts/${form.slug || 'meu-post'}`} fullWidth>
                <input
                  type="text"
                  value={form.slug}
                  onChange={e => { set('slug', e.target.value); set('slugEdited', true) }}
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
                border: '1px solid rgba(146,109,71,0.1)',
                marginBottom: '8px',
              }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: '10px', letterSpacing: '0.2em', color: '#f3be4a', marginBottom: '12px', textTransform: 'uppercase' }}>
                  {'Pr\u00e9-visualiza\u00e7\u00e3o no Google'}
                </p>
                <div style={{ fontFamily: 'Arial, sans-serif' }}>
                  <div style={{ color: '#1a0dab', fontSize: '18px', marginBottom: '4px' }}>
                    {form.metaTitle || form.title || 'T\u00edtulo do artigo'}
                  </div>
                  <div style={{ color: '#006621', fontSize: '13px', marginBottom: '4px' }}>
                    seusite.com/posts/{form.slug || 'slug-do-post'}
                  </div>
                  <div style={{ color: '#545454', fontSize: '13px', lineHeight: '1.5' }}>
                    {form.metaDescription || form.excerpt || 'Descri\u00e7\u00e3o do artigo para os motores de busca...'}
                  </div>
                </div>
              </div>

              <Field label="Meta Title" hint={`${(form.metaTitle || form.title).length}/60`}>
                <input type="text" value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)}
                  placeholder={form.title || 'T\u00edtulo para o Google'} maxLength={65} style={inputStyle} />
              </Field>

              <Field label="Meta Description" hint={`${metaDescLength}/160 caracteres`}>
                <textarea value={form.metaDescription} onChange={e => set('metaDescription', e.target.value)}
                  placeholder="Descri\u00e7\u00e3o de 150-160 caracteres para aparecer no Google..." maxLength={165}
                  rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </Field>
            </div>
          )}

          {/* Tab: Publicacao */}
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
                <Field label="Data e Hora de Publica\u00e7\u00e3o">
                  <input type="datetime-local" value={form.scheduledAt}
                    onChange={e => set('scheduledAt', e.target.value)} style={inputStyle} />
                </Field>
              )}

              <div style={{
                gridColumn: '1 / -1',
                padding: '20px 24px',
                background: 'white',
                border: '1px solid rgba(146,109,71,0.1)',
                marginTop: '8px',
              }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: '10px', letterSpacing: '0.2em', color: '#f3be4a', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Resumo
                </p>
                <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 24px', fontSize: '15px' }}>
                  {[
                    ['T\u00edtulo', form.title || '\u2014'],
                    ['Categorias', (form.categories || []).join(', ') || '\u2014'],
                    ['Autor', form.author || '\u2014'],
                    ['Status', form.status],
                    ['Data', form.date],
                    ['Slug', form.slug || slugify(form.title) || '\u2014'],
                  ].map(([k, v], i) => (
                    <div key={i} style={{ display: 'contents' }}>
                      <dt style={{ color: '#aaa', fontFamily: "'Cinzel', serif", fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', paddingTop: '4px' }}>{k}</dt>
                      <dd style={{ margin: 0, color: '#1A1208' }}>{v}</dd>
                    </div>
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
  border: '1px solid rgba(146,109,71,0.2)',
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
        <label style={{ fontFamily: "'Cinzel', serif", fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#f3be4a' }}>
          {label}
        </label>
        {hint && <span style={{ fontSize: '12px', color: '#aaa', fontStyle: 'italic' }}>{hint}</span>}
      </div>
      {children}
    </div>
  )
}
