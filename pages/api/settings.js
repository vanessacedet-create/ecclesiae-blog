import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
const owner = process.env.GITHUB_OWNER
const repo = process.env.GITHUB_REPO
const branch = process.env.GITHUB_BRANCH || 'main'

const defaultSettings = {
  storeUrl: 'https://www.editoraecclesiae.com.br',
  instagram: '',
  facebook: '',
  youtube: '',
  twitter: '',
  tiktok: '',
  email: 'contato@editoraecclesiae.com.br',
}

async function getSettings() {
  try {
    const { data } = await octokit.repos.getContent({
      owner, repo, path: 'config/settings.json', ref: branch
    })
    const content = Buffer.from(data.content, 'base64').toString('utf8')
    const parsed = JSON.parse(content)
    return { settings: { ...defaultSettings, ...parsed }, sha: data.sha }
  } catch (e) {
    return { settings: defaultSettings, sha: null }
  }
}

async function saveSettings({ settings, sha }) {
  const content = JSON.stringify(settings, null, 2)
  const encoded = Buffer.from(content).toString('base64')
  await octokit.repos.createOrUpdateFileContents({
    owner, repo, branch,
    path: 'config/settings.json',
    message: '\u2720 Atualiza configura\u00e7\u00f5es do blog',
    content: encoded,
    ...(sha ? { sha } : {}),
  })
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const data = await getSettings()
    return res.status(200).json(data)
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'N\u00e3o autorizado' })

  if (req.method === 'POST') {
    try {
      const { settings, sha } = req.body
      if (!settings) return res.status(400).json({ error: 'Dados inv\u00e1lidos' })
      await saveSettings({ settings, sha })
      return res.status(200).json({ success: true })
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  }

  res.status(405).end()
}
