import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { listPosts } from '../../../lib/github'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Não autorizado' })

  if (req.method === 'GET') {
    const posts = await listPosts()
    return res.status(200).json(posts)
  }

  res.status(405).end()
}
