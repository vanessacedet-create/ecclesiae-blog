import { useState, useRef, useEffect } from 'react'
import ImageUploader from './ImageUploader'

const TOOLBAR_BUTTONS = [
  { label: 'H2', title: 'Subtítulo', action: 'heading2', icon: 'H₂' },
  { label: 'H3', title: 'Subtítulo menor', action: 'heading3', icon: 'H₃' },
  { label: 'B', title: 'Negrito', action: 'bold', icon: '𝐁' },
  { label: 'I', title: 'Itálico', action: 'italic', icon: '𝘐' },
  { label: '"', title: 'Citação', action: 'blockquote', icon: '❝' },
  { label: '—', title: 'Separador', action: 'divider', icon: '—' },
  { label: '•', title: 'Lista', action: 'list', icon: '≡' },
]

export default function RichEditor({ value, onChange }) {
  const [markdown, setMarkdown] = useState(value || '')
  const [showPreview, setShowPreview] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')
  const [showImageUploader, setShowImageUploader] = useState(false)
  const textareaRef = useRef(null)
  const autoSaveTimer = useRef(null)

  useEffect(() => {
    setMarkdown(value || '')
  }, [value])

  useEffect(() => {
    clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(() => {
      onChange(markdown)
    }, 800)
    return () => clearTimeout(autoSaveTimer.current)
  }, [markdown])

  useEffect(() => {
    if (!showPreview) return
    setPreviewHtml(markdownToHtml(markdown))
  }, [showPreview, markdown])

  function markdownToHtml(md) {
    return md
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" style="max-width:100%;margin:16px 0;display:block;" />')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/^---$/gm, '<hr>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
      .split('\n\n').map(p => {
        if (p.trim().startsWith('<')) return p
        return `<p>${p}</p>`
      }).join('\n')
  }

  function insertAtCursor(before, after = '', defaultText = '') {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = markdown.slice(start, end) || defaultText
    const newText = markdown.slice(0, start) + before + selected + after + markdown.slice(end)
    setMarkdown(newText)
    setTimeout(() => {
      const pos = start + before.length + selected.length + after.length
      ta.focus()
      ta.setSelectionRange(pos, pos)
    }, 0)
  }

  function handleAction(action) {
    switch (action) {
      case 'heading2': insertAtCursor('\n## ', '', 'Subtítulo'); break
      case 'heading3': insertAtCursor('\n### ', '', 'Subtítulo menor'); break
      case 'bold': insertAtCursor('**', '**', 'texto em negrito'); break
      case 'italic': insertAtCursor('*', '*', 'texto em itálico'); break
      case 'blockquote': insertAtCursor('\n> ', '', 'Citação aqui'); break
      case 'divider': insertAtCursor('\n\n---\n\n'); break
      case 'list': insertAtCursor('\n- ', '', 'item da lista'); break
    }
  }

  function handleInsertImage(markdownText) {
    const ta = textareaRef.current
    const pos = ta ? ta.selectionStart : markdown.length
    const newText = markdown.slice(0, pos) + '\n\n' + markdownText + '\n\n' + markdown.slice(pos)
    setMarkdown(newText)
  }

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault()
      insertAtCursor('  ')
    }
  }

  const wordCount = markdown.trim().split(/\s+/).filter(Boolean).length
  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  const btnStyle = {
    background: 'transparent',
    border: '1px solid rgba(92,30,30,0.2)',
    color: '#5C1E1E',
    padding: '4px 10px',
    cursor: 'pointer',
    fontFamily: "'EB Garamond', serif",
    fontSize: '15px',
    minWidth: '32px',
    transition: 'all 0.15s',
  }

  return (
    <div style={{ border: '1px solid rgba(92,30,30,0.2)', background: 'white' }}>

      {/* Image uploader modal */}
      {showImageUploader && (
        <ImageUploader
          onInsert={handleInsertImage}
          onClose={() => setShowImageUploader(false)}
        />
      )}

      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        borderBottom: '1px solid rgba(92,30,30,0.1)',
        background: '#FAF7F2',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
          {TOOLBAR_BUTTONS.map(btn => (
            <button
              key={btn.action}
              type="button"
              title={btn.title}
              onClick={() => handleAction(btn.action)}
              style={btnStyle}
              onMouseEnter={e => { e.currentTarget.style.background = '#5C1E1E'; e.currentTarget.style.color = '#FAF7F2' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#5C1E1E' }}
            >
              {btn.icon}
            </button>
          ))}

          <span style={{ width: '1px', height: '20px', background: 'rgba(92,30,30,0.15)', margin: '0 4px', display: 'inline-block' }} />

          <button
            type="button"
            title="Inserir imagem"
            onClick={() => setShowImageUploader(true)}
            style={btnStyle}
            onMouseEnter={e => { e.currentTarget.style.background = '#5C1E1E'; e.currentTarget.style.color = '#FAF7F2' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#5C1E1E' }}
          >
            🖼
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '12px', color: '#aaa', fontStyle: 'italic' }}>
            {wordCount} palavras · ~{readTime} min leitura
          </span>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            style={{
              background: showPreview ? '#5C1E1E' : 'transparent',
              border: '1px solid rgba(92,30,30,0.3)',
              color: showPreview ? '#FAF7F2' : '#5C1E1E',
              padding: '4px 14px',
              cursor: 'pointer',
              fontFamily: "'Cinzel', serif",
              fontSize: '9px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
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
            minHeight: '400px',
            padding: '32px 40px',
            fontFamily: "'EB Garamond', serif",
            fontSize: '18px',
            lineHeight: '1.9',
            color: '#2A1F10',
          }}
          dangerouslySetInnerHTML={{ __html: previewHtml || '<em style="color:#aaa">Nenhum conteúdo ainda...</em>' }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={markdown}
          onChange={e => setMarkdown(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Escreva o artigo aqui...\n\nDicas:\n## Subtítulo — use ## para criar seções\n> Citação — use > para destacar um trecho\n**negrito** e *itálico* para ênfase\n🖼 Use o botão de imagem na toolbar para inserir fotos`}
          style={{
            width: '100%',
            minHeight: '480px',
            padding: '32px 40px',
            border: 'none',
            outline: 'none',
            resize: 'vertical',
            fontFamily: "'EB Garamond', serif",
            fontSize: '18px',
            lineHeight: '1.9',
            color: '#2A1F10',
            background: 'white',
            boxSizing: 'border-box',
          }}
        />
      )}

      {/* Markdown hint */}
      {!showPreview && (
        <div style={{
          padding: '8px 16px',
          borderTop: '1px solid rgba(92,30,30,0.08)',
          background: '#FAF7F2',
          fontSize: '11px',
          color: '#bbb',
          fontFamily: "'Cinzel', serif",
          letterSpacing: '0.1em',
        }}>
          Markdown: **negrito** · *itálico* · ## título · &gt; citação · --- separador · 🖼 imagem
        </div>
      )}
    </div>
  )
}
