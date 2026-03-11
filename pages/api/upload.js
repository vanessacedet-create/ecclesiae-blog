import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'

export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } }
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Não autorizado' })

  if (req.method !== 'POST') return res.status(405).end()

  try {
    const { image, filename } = req.body

    if (!image) return res.status(400).json({ error: 'Nenhuma imagem enviada' })

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(500).json({ error: 'Cloudinary não configurado. Verifique as variáveis de ambiente.' })
    }

    // Build form data for Cloudinary
    const timestamp = Math.round(Date.now() / 1000)
    const folder = 'ecclesiae-blog'

    // Create signature
    const crypto = await import('crypto')
    const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
    const signature = crypto.createHash('sha1').update(signatureString).digest('hex')

    // Post to Cloudinary
    const formData = new URLSearchParams()
    formData.append('file', image)
    formData.append('timestamp', timestamp)
    formData.append('api_key', apiKey)
    formData.append('signature', signature)
    formData.append('folder', folder)
    if (filename) formData.append('public_id', filename)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: formData }
    )

    const data = await response.json()

    if (data.error) {
      return res.status(400).json({ error: data.error.message })
    }

    return res.status(200).json({
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
    })
  } catch (e) {
    console.error('Upload error:', e)
    return res.status(500).json({ error: 'Erro ao fazer upload: ' + e.message })
  }
}
