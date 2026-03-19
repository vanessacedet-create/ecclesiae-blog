import { useState, useRef, useEffect, useCallback } from 'react'
import ImageUploader from './ImageUploader'

const TOOLBAR_BUTTONS = [
  { title: 'Subt\u00edtulo', action: 'heading2', icon: 'H\u2082' },
  { title: 'Subt\u00edtulo menor', action: 'heading3', icon: 'H\u2083' },
  { title: 'Negrito', action: 'bold', icon: '\uD835\uDC01' },
  { title: 'It\u00e1lico', action: 'italic', icon: '\uD835\uDE10' },
  { title: 'Cita\u00e7\u00e3o', action: 'blockquote', icon: '\u275D' },
  { title: 'Separador', action: 'divider', icon: '\u2014' },
  { title: 'Lista', action: 'list', icon: '\u2261' },
  { title: 'Link', action: 'link', icon: '\uD83D\uDD17' },
]

// ─── Button Creator Modal ───
function ButtonCreator({ onInsert, onClose }) {
  const [text, setText] = useState('Saiba mais')
  const [url, setUrl] = useState('')
  const [bgColor, setBgColor] = useState('#926d47')
  const [textColor, setTextColor] = useState('#ffffff')
  const [borderRadius, setBorderRadius] = useState('0')
  const [size, setSize] = useState('medium')

  const sizeStyles = {
    small: 'padding:8px 20px;font-size:12px;',
    medium: 'padding:12px 28px;font-size:14px;',
    large: 'padding:16px 36px;font-size:16px;',
  }

  const previewStyle = {
    display: 'inline-block',
    backgroundColor: bgColor,
    color: textColor,
    borderRadius: borderRadius + 'px',
    border: 'none',
    textDecoration: 'none',
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    fontWeight: '600',
    cursor: 'pointer',
    ...(size === 'small' ? { padding: '8px 20px', fontSize: '12px' } : {}),
    ...(size === 'medium' ? { padding: '12px 28px', fontSize: '14px' } : {}),
    ...(size === 'large' ? { padding: '16px 36px', fontSize: '16px' } : {}),
  }

  function handleInsert() {
    if (!url || !text) {
      alert('Preencha o texto e a URL do bot\u00e3o.')
      return
    }
    const style = `display:inline-block;background-color:${bgColor};color:${textColor};border-radius:${borderRadius}px;text-decoration:none;font-family:'Cinzel',serif;letter-spacing:0.15em;text-transform:uppercase;font-weight:600;${sizeStyles[size]}`
    const html = `\n\n<a href="${url}" target="_blank" rel="noopener noreferrer" style="${style}">${text}</a>\n\n`
    onInsert(html)
    onClose()
  }

  const inputStyle = {
    width: '100%', padding: '8px 12px',
    border: '1px solid rgba(146,109,71,0.2)',
    fontFamily: "'EB Garamond', serif", fontSize: '15px',
    color: '#1A1208', outline: 'none', boxSizing: 'border-box',
  }

  const labelStyle = {
    display: 'block', fontFamily: "'Cinzel', serif",
    fontSize: '9px', letterSpacing: '0.2em',
    textTransform: 'uppercase', color: '#f3be4a', marginBottom: '4px',
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
      <div style={{ background: '#fffdf7', width: '100%', maxWidth: '480px', fontFamily: "'EB Garamond', serif" }}>
        {/* Header */}
        <div style={{
          background: '#926d47', padding: '14px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#fffdf7' }}>
            Criar Bot\u00e3o
          </span>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,253,247,0.5)', cursor: 'pointer', fontSize: '18px' }}>{'\u2715'}</button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Text */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Texto do bot\u00e3o</label>
            <input type="text" value={text} onChange={e => setText(e.target.value)}
              placeholder="Ex: Compre agora, Saiba mais..." style={inputStyle} />
          </div>

          {/* URL */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Link (URL)</label>
            <input type="text" value={url} onChange={e => setUrl(e.target.value)}
              placeholder="https://www.editoraecclesiae.com.br/livro" style={inputStyle} />
          </div>

          {/* Colors row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={labelStyle}>Cor do fundo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                  style={{ width: '36px', height: '36px', border: '1px solid rgba(146,109,71,0.2)', cursor: 'pointer', padding: '2px' }} />
                <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)}
                  style={{ ...inputStyle, flex: 1, fontSize: '13px' }} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Cor do texto</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)}
                  style={{ width: '36px', height: '36px', border: '1px solid rgba(146,109,71,0.2)', cursor: 'pointer', padding: '2px' }} />
                <input type="text" value={textColor} onChange={e => setTextColor(e.target.value)}
                  style={{ ...inputStyle, flex: 1, fontSize: '13px' }} />
              </div>
            </div>
          </div>

          {/* Border radius + size */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
            <div>
              <label style={labelStyle}>Formato (arredondamento)</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { value: '0', label: 'Reto' },
                  { value: '6', label: 'Leve' },
                  { value: '20', label: 'Redondo' },
                  { value: '50', label: 'P\u00edlula' },
                ].map(opt => (
                  <button key={opt.value} type="button" onClick={() => setBorderRadius(opt.value)}
                    style={{
                      flex: 1, padding: '5px 4px',
                      border: borderRadius === opt.value ? '2px solid #926d47' : '1px solid rgba(146,109,71,0.2)',
                      background: borderRadius === opt.value ? '#926d47' : 'white',
                      color: borderRadius === opt.value ? '#fffdf7' : '#926d47',
                      fontFamily: "'Cinzel', serif", fontSize: '8px',
                      letterSpacing: '0.05em', textTransform: 'uppercase',
                      cursor: 'pointer', fontWeight: borderRadius === opt.value ? '600' : '400',
                    }}
                  >{opt.label}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Tamanho</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { value: 'small', label: 'P' },
                  { value: 'medium', label: 'M' },
                  { value: 'large', label: 'G' },
                ].map(opt => (
                  <button key={opt.value} type="button" onClick={() => setSize(opt.value)}
                    style={{
                      flex: 1, padding: '5px 4px',
                      border: size === opt.value ? '2px solid #926d47' : '1px solid rgba(146,109,71,0.2)',
                      background: size === opt.value ? '#926d47' : 'white',
                      color: size === opt.value ? '#fffdf7' : '#926d47',
                      fontFamily: "'Cinzel', serif", fontSize: '8px',
                      letterSpacing: '0.05em', textTransform: 'uppercase',
                      cursor: 'pointer', fontWeight: size === opt.value ? '600' : '400',
                    }}
                  >{opt.label}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>{'Pr\u00e9-visualiza\u00e7\u00e3o'}</label>
            <div style={{ padding: '20px', background: 'white', border: '1px solid rgba(146,109,71,0.1)', textAlign: 'center' }}>
              <a href="#" onClick={e => e.preventDefault()} style={previewStyle}>{text || 'Bot\u00e3o'}</a>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{
              background: 'transparent', border: '1px solid rgba(146,109,71,0.25)', color: '#926d47',
              padding: '10px 20px', fontFamily: "'Cinzel', serif", fontSize: '10px',
              letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer',
            }}>Cancelar</button>
            <button onClick={handleInsert} style={{
              background: '#926d47', border: 'none', color: '#fffdf7',
              padding: '10px 24px', fontFamily: "'Cinzel', serif", fontSize: '10px',
              fontWeight: '600', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer',
            }}>Inserir Bot\u00e3o</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main RichEditor ───
export default function RichEditor({ value, onChange }) {
  const [markdown, setMarkdown] = useState(value || '')
  const [showPreview, setShowPreview] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')
  const [showImageUploader, setShowImageUploader] = useState(false)
  const [showButtonCreator, setShowButtonCreator] = useState(false)
  const textareaRef = useRef(null)
  const cursorPosRef = useRef(null)

  const initializedRef = useRef(false)
  useEffect(() => {
    if (!initializedRef.current) {
      setMarkdown(value || '')
      initializedRef.current = true
    }
  }, [value])

  const debounceRef = useRef(null)
  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onChange(markdown)
    }, 600)
    return () => clearTimeout(debounceRef.current)
  }, [markdown])

  useEffect(() => {
    if (cursorPosRef.current !== null && textareaRef.current && !showPreview) {
      const pos = cursorPosRef.current
      textareaRef.current.setSelectionRange(pos, pos)
      cursorPosRef.current = null
    }
  }, [markdown, showPreview])

  useEffect(() => {
    if (!showPreview) return
    setPreviewHtml(markdownToHtml(markdown))
  }, [showPreview, markdown])

  function markdownToHtml(md) {
    return md
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" style="max-width:100%;margin:16px 0;display:block;" />')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/^---$/gm, '<hr>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#926d47;text-decoration:underline;">$1</a>')
      .split('\n\n').map(p => {
        if (p.trim().startsWith('<')) return p
        return `<p>${p}</p>`
      }).join('\n')
  }

  const insertAtCursor = useCallback((before, after = '', defaultText = '') => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = markdown.slice(start, end) || defaultText
    const newText = markdown.slice(0, start) + before + selected + after + markdown.slice(end)
    const newPos = start + before.length + selected.length + after.length
    cursorPosRef.current = newPos
    setMarkdown(newText)
    setTimeout(() => { if (ta) ta.focus() }, 10)
  }, [markdown])

  function handleAction(action) {
    switch (action) {
      case 'heading2': insertAtCursor('\n## ', '\n', 'Subt\u00edtulo'); break
      case 'heading3': insertAtCursor('\n### ', '\n', 'Subt\u00edtulo menor'); break
      case 'bold': insertAtCursor('**', '**', 'texto em negrito'); break
      case 'italic': insertAtCursor('*', '*', 'texto em it\u00e1lico'); break
      case 'blockquote': insertAtCursor('\n> ', '\n', 'Cita\u00e7\u00e3o aqui'); break
      case 'divider': insertAtCursor('\n\n---\n\n'); break
      case 'list': insertAtCursor('\n- ', '\n', 'item da lista'); break
      case 'link': {
        const url = prompt('URL do link:')
        if (url) insertAtCursor('[', `](${url})`, 'texto do link')
        break
      }
    }
  }

  function handleInsertContent(content) {
    const ta = textareaRef.current
    const pos = ta ? ta.selectionStart : markdown.length
    const newText = markdown.slice(0, pos) + '\n\n' + content + '\n\n' + markdown.slice(pos)
    cursorPosRef.current = pos + content.length + 4
    setMarkdown(newText)
  }

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault()
      insertAtCursor('  ')
    }
  }

  function handleTextareaChange(e) {
    cursorPosRef.current = e.target.selectionStart
    setMarkdown(e.target.value)
  }

  const wordCount = markdown.trim().split(/\s+/).filter(Boolean).length
  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  const btnStyle = {
    background: 'transparent',
    border: '1px solid rgba(146,109,71,0.2)',
    color: '#926d47',
    padding: '4px 10px',
    cursor: 'pointer',
    fontFamily: "'EB Garamond', serif",
    fontSize: '15px',
    minWidth: '32px',
    transition: 'all 0.15s',
  }

  const btnHover = (e, enter) => {
    e.currentTarget.style.background = enter ? '#926d47' : 'transparent'
    e.currentTarget.style.color = enter ? '#fffdf7' : '#926d47'
  }

  return (
    <div style={{ border: '1px solid rgba(146,109,71,0.2)', background: 'white' }}>

      {showImageUploader && (
        <ImageUploader
          onInsert={(md) => handleInsertContent(md)}
          onClose={() => setShowImageUploader(false)}
        />
      )}

      {showButtonCreator && (
        <ButtonCreator
          onInsert={(html) => handleInsertContent(html)}
          onClose={() => setShowButtonCreator(false)}
        />
      )}

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', borderBottom: '1px solid rgba(146,109,71,0.1)',
        background: '#fffdf7', flexWrap: 'wrap', gap: '8px',
      }}>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
          {TOOLBAR_BUTTONS.map(btn => (
            <button key={btn.action} type="button" title={btn.title}
              onClick={() => handleAction(btn.action)} style={btnStyle}
              onMouseEnter={e => btnHover(e, true)} onMouseLeave={e => btnHover(e, false)}>
              {btn.icon}
            </button>
          ))}

          <span style={{ width: '1px', height: '20px', background: 'rgba(146,109,71,0.15)', margin: '0 4px', display: 'inline-block' }} />

          {/* Image button */}
          <button type="button" title="Inserir imagem" onClick={() => setShowImageUploader(true)}
            style={btnStyle} onMouseEnter={e => btnHover(e, true)} onMouseLeave={e => btnHover(e, false)}>
            {'\uD83D\uDDBC'}
          </button>

          {/* Custom button creator */}
          <button type="button" title="Inserir bot\u00e3o com link" onClick={() => setShowButtonCreator(true)}
            style={{ ...btnStyle, fontSize: '12px', letterSpacing: '0.05em' }}
            onMouseEnter={e => btnHover(e, true)} onMouseLeave={e => btnHover(e, false)}>
            {'Bot\u00e3o'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '12px', color: '#aaa', fontStyle: 'italic' }}>
            {wordCount} palavras {'\u00b7'} ~{readTime} min leitura
          </span>
          <button type="button" onClick={() => setShowPreview(!showPreview)}
            style={{
              background: showPreview ? '#926d47' : 'transparent',
              border: '1px solid rgba(146,109,71,0.3)',
              color: showPreview ? '#fffdf7' : '#926d47',
              padding: '4px 14px', cursor: 'pointer',
              fontFamily: "'Cinzel', serif", fontSize: '9px',
              letterSpacing: '0.2em', textTransform: 'uppercase',
            }}>
            {showPreview ? 'Editar' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Editor / Preview */}
      {showPreview ? (
        <div style={{
          minHeight: '400px', padding: '32px 40px',
          fontFamily: "'EB Garamond', serif", fontSize: '18px',
          lineHeight: '1.9', color: '#1A1208',
        }}
          dangerouslySetInnerHTML={{ __html: previewHtml || '<em style="color:#aaa">Nenhum conte\u00fado ainda...</em>' }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={markdown}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={`Escreva o artigo aqui...\n\nDicas:\n## Subt\u00edtulo \u2014 use ## para criar se\u00e7\u00f5es\n> Cita\u00e7\u00e3o \u2014 use > para destacar um trecho\n**negrito** e *it\u00e1lico* para \u00eanfase\n\uD83D\uDDBC Use o bot\u00e3o de imagem na toolbar\nBot\u00e3o \u2014 crie bot\u00f5es personalizados com link`}
          style={{
            width: '100%', minHeight: '480px', padding: '32px 40px',
            border: 'none', outline: 'none', resize: 'vertical',
            fontFamily: "'EB Garamond', serif", fontSize: '18px',
            lineHeight: '1.9', color: '#1A1208', background: 'white',
            boxSizing: 'border-box',
          }}
        />
      )}

      {/* Markdown hint */}
      {!showPreview && (
        <div style={{
          padding: '8px 16px', borderTop: '1px solid rgba(146,109,71,0.08)',
          background: '#fffdf7', fontSize: '11px', color: '#bbb',
          fontFamily: "'Cinzel', serif", letterSpacing: '0.1em',
        }}>
          **negrito** {'\u00b7'} *it\u00e1lico* {'\u00b7'} ## t\u00edtulo {'\u00b7'} &gt; cita\u00e7\u00e3o {'\u00b7'} --- separador {'\u00b7'} \uD83D\uDDBC imagem {'\u00b7'} Bot\u00e3o personalizado
        </div>
      )}
    </div>
  )
}
