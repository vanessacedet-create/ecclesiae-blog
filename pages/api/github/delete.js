import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { deletePost } from '../../../lib/github'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'N\u00e3o autorizado' })

  if (req.method === 'POST') {
    try {
      const { path, sha, title } = req.body
      if (!path || !sha) {
        return res.status(400).json({ error: 'Path e SHA s\u00e3o obrigat\u00f3rios' })
      }
      await deletePost({ path, sha, title: title || 'Post' })
      return res.status(200).json({ success: true })
    } catch (e) {
      console.error('Delete error:', e)
      return res.status(500).json({ error: e.message })
    }
  }

  res.status(405).end()
}
