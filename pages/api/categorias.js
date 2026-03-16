import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
const owner = process.env.GITHUB_OWNER
const repo = process.env.GITHUB_REPO
const branch = process.env.GITHUB_BRANCH || 'main'

async function getCategorias() {
  try {
    const { data } = await octokit.repos.getContent({
      owner, repo, path: 'config/categorias.json', ref: branch
    })
    const content = Buffer.from(data.content, 'base64').toString('utf8')
    const parsed = JSON.parse(content)
    return { categorias: parsed.categorias, sha: data.sha }
  } catch (e) {
    return {
      sha: null,
      categorias: [
        { id: 'biblia', label: 'Bíblia', slug: 'biblia' },
        { id: 'guias-de-leitura', label: 'Guias de leitura', slug: 'guias-de-leitura' },
        { id: 'vida-dos-santos', label: 'Vida dos santos', slug: 'vida-dos-santos' },
        { id: 'catolicismo', label: 'Catolicismo', slug: 'catolicismo' },
      ]
    }
  }
}

async function saveCategorias({ categorias, sha }) {
  const content = JSON.stringify({ categorias }, null, 2)
  const encoded = Buffer.from(content).toString('base64')
  await octokit.repos.createOrUpdateFileContents({
    owner, repo, branch,
    path: 'config/categorias.json',
    message: '⚙️ Atualiza categorias do blog',
    content: encoded,
    ...(sha ? { sha } : {}),
  })
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Não autorizado' })

  if (req.method === 'GET') {
    const data = await getCategorias()
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    try {
      const { categorias, sha } = req.body
      if (!Array.isArray(categorias)) return res.status(400).json({ error: 'Dados inválidos' })
      await saveCategorias({ categorias, sha })
      return res.status(200).json({ success: true })
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  }

  res.status(405).end()
}
