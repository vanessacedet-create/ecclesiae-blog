import fs from 'fs'
import path from 'path'

const DEFAULT_CATEGORIAS = [
  { id: 'biblia', label: 'Bíblia', slug: 'biblia' },
  { id: 'guias-de-leitura', label: 'Guias de leitura', slug: 'guias-de-leitura' },
  { id: 'vida-dos-santos', label: 'Vida dos santos', slug: 'vida-dos-santos' },
  { id: 'catolicismo', label: 'Catolicismo', slug: 'catolicismo' },
]

export function getCategoriasLocal() {
  try {
    const filePath = path.join(process.cwd(), 'config', 'categorias.json')
    if (!fs.existsSync(filePath)) return DEFAULT_CATEGORIAS
    const raw = fs.readFileSync(filePath, 'utf8')
    const parsed = JSON.parse(raw)
    return parsed.categorias || DEFAULT_CATEGORIAS
  } catch (e) {
    return DEFAULT_CATEGORIAS
  }
}
