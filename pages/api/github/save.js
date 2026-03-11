import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { savePost, slugify } from '../../../lib/github'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Não autorizado' })

  if (req.method === 'POST') {
    try {
      const { title, date, category, author, excerpt, body, slug,
              status, metaTitle, metaDescription, tags, scheduledAt, sha } = req.body

      if (!title || !body) return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' })

      const filename = slug || slugify(title)
      const frontmatter = { title, date: date || new Date().toISOString().split('T')[0],
        category, author, excerpt, slug: filename, status: status || 'published',
        metaTitle, metaDescription, tags, scheduledAt }

      await savePost({ filename, frontmatter, body, sha })
      return res.status(200).json({ success: true, filename })
    } catch (e) {
      console.error(e)
      return res.status(500).json({ error: e.message })
    }
  }

  res.status(405).end()
}
