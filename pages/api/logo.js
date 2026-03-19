import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
const owner = process.env.GITHUB_OWNER
const repo = process.env.GITHUB_REPO
const branch = process.env.GITHUB_BRANCH || 'main'

// Accepted logo formats and their extensions
const LOGO_FORMATS = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/svg+xml': 'svg',
  'image/webp': 'webp',
}

async function getLogo() {
  // Try each format
  for (const ext of ['png', 'svg', 'jpg', 'webp']) {
    try {
      const { data } = await octokit.repos.getContent({
        owner, repo, path: `public/logo-ecclesiae.${ext}`, ref: branch
      })
      return { exists: true, sha: data.sha, download_url: data.download_url, ext }
    } catch (e) {
      continue
    }
  }
  return { exists: false, sha: null, download_url: null, ext: null }
}

async function saveLogo({ base64Content, sha, ext, oldExt }) {
  // If format changed, delete old file first
  if (oldExt && oldExt !== ext) {
    try {
      const { data: oldFile } = await octokit.repos.getContent({
        owner, repo, path: `public/logo-ecclesiae.${oldExt}`, ref: branch
      })
      await octokit.repos.deleteFile({
        owner, repo, branch,
        path: `public/logo-ecclesiae.${oldExt}`,
        message: 'Remove logo antiga',
        sha: oldFile.sha,
      })
    } catch (e) {
      // Old file doesn't exist, that's fine
    }
  }

  await octokit.repos.createOrUpdateFileContents({
    owner, repo, branch,
    path: `public/logo-ecclesiae.${ext}`,
    message: '\u2720 Atualiza logo do blog',
    content: base64Content,
    ...(oldExt === ext && sha ? { sha } : {}),
  })
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
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
      const { base64Content, sha, mimeType, oldExt } = req.body
      if (!base64Content) return res.status(400).json({ error: 'Nenhuma imagem enviada' })

      const ext = LOGO_FORMATS[mimeType] || 'png'
      await saveLogo({ base64Content, sha, ext, oldExt })
      return res.status(200).json({ success: true, ext })
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { sha, ext } = req.body
      if (!sha) return res.status(400).json({ error: 'SHA necess\u00e1rio para deletar' })
      await octokit.repos.deleteFile({
        owner, repo, branch,
        path: `public/logo-ecclesiae.${ext || 'png'}`,
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
