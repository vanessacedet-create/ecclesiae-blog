import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
const owner = process.env.GITHUB_OWNER
const repo = process.env.GITHUB_REPO
const branch = process.env.GITHUB_BRANCH || 'main'

async function getLogo() {
  try {
    const { data } = await octokit.repos.getContent({
      owner, repo, path: 'public/logo-ecclesiae.png', ref: branch
    })
    return { exists: true, sha: data.sha, download_url: data.download_url }
  } catch (e) {
    return { exists: false, sha: null, download_url: null }
  }
}

async function saveLogo({ base64Content, sha }) {
  await octokit.repos.createOrUpdateFileContents({
    owner, repo, branch,
    path: 'public/logo-ecclesiae.png',
    message: '\u2720 Atualiza logo do blog',
    content: base64Content,
    ...(sha ? { sha } : {}),
  })
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'N\u00e3o autorizado' })

  if (req.method === 'GET') {
    const data = await getLogo()
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    try {
      const { base64Content, sha } = req.body
      if (!base64Content) return res.status(400).json({ error: 'Nenhuma imagem enviada' })
      await saveLogo({ base64Content, sha })
      return res.status(200).json({ success: true })
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { sha } = req.body
      if (!sha) return res.status(400).json({ error: 'SHA necess\u00e1rio para deletar' })
      await octokit.repos.deleteFile({
        owner, repo, branch,
        path: 'public/logo-ecclesiae.png',
        message: '\u2720 Remove logo do blog',
        sha,
      })
      return res.status(200).json({ success: true })
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  }

  res.status(405).end()
}
