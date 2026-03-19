import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
const owner = process.env.GITHUB_OWNER
const repo = process.env.GITHUB_REPO
const branch = process.env.GITHUB_BRANCH || 'main'

export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } }
}

function getExtFromDataUrl(dataUrl) {
  const match = dataUrl.match(/^data:image\/(\w+);/)
  if (!match) return 'png'
  const type = match[1]
  if (type === 'jpeg') return 'jpg'
  return type
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'N\u00e3o autorizado' })
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const { image, filename } = req.body
    if (!image) return res.status(400).json({ error: 'Nenhuma imagem enviada' })

    // Extract base64 content and extension from data URL
    const ext = getExtFromDataUrl(image)
    const base64Content = image.split(',')[1]
    if (!base64Content) return res.status(400).json({ error: 'Formato de imagem inv\u00e1lido' })

    // Generate unique filename
    const timestamp = Date.now()
    const safeName = filename
      ? filename.replace(/[^a-z0-9-]/gi, '-').toLowerCase()
      : 'img'
    const filePath = `public/images/${safeName}-${timestamp}.${ext}`

    // Upload to GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner, repo, branch,
      path: filePath,
      message: `\uD83D\uDDBC Adiciona imagem: ${safeName}.${ext}`,
      content: base64Content,
    })

    // The image will be available at /images/filename after deploy
    // For immediate use, we can use the raw GitHub URL
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`

    return res.status(200).json({
      url: rawUrl,
      path: filePath,
      publicPath: filePath.replace('public/', '/'),
    })
  } catch (e) {
    console.error('Upload error:', e)
    return res.status(500).json({ error: 'Erro ao fazer upload: ' + e.message })
  }
}
