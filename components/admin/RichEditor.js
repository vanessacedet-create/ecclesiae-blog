import { useState, useRef, useEffect, useCallback } from 'react'
import ImageUploader from './ImageUploader'

const TOOLBAR_BUTTONS = [
  { label: 'H2', title: 'Subt\u00edtulo', action: 'heading2', icon: 'H\u2082' },
  { label: 'H3', title: 'Subt\u00edtulo menor', action: 'heading3', icon: 'H\u2083' },
  { label: 'B', title: 'Negrito', action: 'bold', icon: '\uD835\uDC01' },
  { label: 'I', title: 'It\u00e1lico', action: 'italic', icon: '\uD835\uDE10' },
  { label: '"', title: 'Cita\u00e7\u00e3o', action: 'blockquote', icon: '\u275D' },
  { label: '\u2014', title: 'Separador', action: 'divider', icon: '\u2014' },
  { label: '\u2022', title: 'Lista', action: 'list', icon: '\u2261' },
  { label: '\uD83D\uDD17', title: 'Link', action: 'link', icon: '\uD83D\uDD17' },
]

export default function RichEditor({ value, onChange }) {
  const [markdown, setMarkdown] = useState(value || '')
  const [showPreview, setShowPreview] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')
  const [showImageUploader, setShowImageUploader] = useState(false)
  const textareaRef = useRef(null)
  const cursorPosRef = useRef(null)

  // Sync external value only on first mount
  const initializedRef = useRef(false)
  useEffect(() => {
    if (!initializedRef.current) {
      setMarkdown(value || '')
      initializedRef.current = true
    }
  }, [value])

  // Debounced onChange - notify parent without causing re-render loop
  const debounceRef = useRef(null)
  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onChange(markdown)
    }, 600)
    return () => clearTimeout(debounceRef.current)
  }, [markdown])

  // Restore cursor position after state update
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

    // Calculate new cursor position
    const newPos = start + before.length + selected.length + after.length
    cursorPosRef.current = newPos

    setMarkdown(newText)

    // Also focus the textarea
    setTimeout(() => {
      if (ta) ta.focus()
    }, 10)
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

  function handleInsertImage(markdownText) {
    const ta = textareaRef.current
    const pos = ta ? ta.selectionStart : markdown.length
    const newText = markdown.slice(0, pos) + '\n\n' + markdownText + '\n\n' + markdown.slice(pos)
    cursorPosRef.current = pos + markdownText.length + 4
    setMarkdown(newText)
  }

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault()
      insertAtCursor('  ')
    }
  }

  function handleTextareaChange(e) {
    // Save cursor position before updating
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

  return (
    <div style={{ border: '1px solid rgba(146,109,71,0.2)', background: 'white' }}>

      {showImageUploader && (
        <ImageUploader
          onInsert={handleInsertImage}
          onClose={() => setShowImageUploader(false)}
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
            <button
              key={btn.action}
              type="button"
              title={btn.title}
              onClick={() => handleAction(btn.action)}
              style={btnStyle}
              onMouseEnter={e => { e.currentTarget.style.background = '#926d47'; e.currentTarget.style.color = '#fffdf7' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#926d47' }}
            >
              {btn.icon}
            </button>
          ))}

          <span style={{ width: '1px', height: '20px', background: 'rgba(146,109,71,0.15)', margin: '0 4px', display: 'inline-block' }} />

          <button
            type="button"
            title="Inserir imagem"
            onClick={() => setShowImageUploader(true)}
            style={btnStyle}
            onMouseEnter={e => { e.currentTarget.style.background = '#926d47'; e.currentTarget.style.color = '#fffdf7' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#926d47' }}
          >
            {'\uD83D\uDDBC'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '12px', color: '#aaa', fontStyle: 'italic' }}>
            {wordCount} palavras {'\u00b7'} ~{readTime} min leitura
          </span>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            style={{
              background: showPreview ? '#926d47' : 'transparent',
              border: '1px solid rgba(146,109,71,0.3)',
              color: showPreview ? '#fffdf7' : '#926d47',
              padding: '4px 14px', cursor: 'pointer',
              fontFamily: "'Cinzel', serif", fontSize: '9px',
              letterSpacing: '0.2em', textTransform: 'uppercase',
            }}
          >
            {showPreview ? 'Editar' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Editor / Preview */}
      {showPreview ? (
        <div
          style={{
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
          placeholder={`Escreva o artigo aqui...\n\nDicas:\n## Subt\u00edtulo \u2014 use ## para criar se\u00e7\u00f5es\n> Cita\u00e7\u00e3o \u2014 use > para destacar um trecho\n**negrito** e *it\u00e1lico* para \u00eanfase\n\uD83D\uDDBC Use o bot\u00e3o de imagem na toolbar`}
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
          Markdown: **negrito** {'\u00b7'} *it\u00e1lico* {'\u00b7'} ## t\u00edtulo {'\u00b7'} &gt; cita\u00e7\u00e3o {'\u00b7'} --- separador {'\u00b7'} \uD83D\uDDBC imagem
        </div>
      )}
    </div>
  )
}
