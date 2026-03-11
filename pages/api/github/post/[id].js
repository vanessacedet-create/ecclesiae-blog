import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'
import { getPost, deletePost } from '../../../lib/github'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Não autorizado' })

  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const post = await getPost(id)
      return res.status(200).json(post)
    } catch (e) {
      return res.status(404).json({ error: 'Post não encontrado' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { sha, title } = req.body
      await deletePost({ path: `posts/${id}.md`, sha, title })
      return res.status(200).json({ success: true })
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  }

  res.status(405).end()
}
