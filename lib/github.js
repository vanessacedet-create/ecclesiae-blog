import { Octokit } from '@octokit/rest'
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
const owner = process.env.GITHUB_OWNER
const repo = process.env.GITHUB_REPO
const branch = process.env.GITHUB_BRANCH || 'main'

export function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

export function buildFrontmatter(data) {
  const lines = ['---']
  lines.push(`title: "${data.title.replace(/"/g, '\\"')}"`)
  lines.push(`date: "${data.date}"`)
  // Support multiple categories
  if (data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
    lines.push(`categories: [${data.categories.map(c => `"${c}"`).join(', ')}]`)
    // Keep single category for backwards compatibility (first one)
    lines.push(`category: "${data.categories[0]}"`)
  } else if (data.category) {
    lines.push(`category: "${data.category}"`)
    lines.push(`categories: ["${data.category}"]`)
  }
  if (data.author) lines.push(`author: "${data.author}"`)
  if (data.excerpt) lines.push(`excerpt: "${data.excerpt.replace(/"/g, '\\"')}"`)
  if (data.slug) lines.push(`slug: "${data.slug}"`)
  if (data.status) lines.push(`status: "${data.status}"`)
  if (data.coverImage) lines.push(`coverImage: "${data.coverImage}"`)
  if (data.coverPosition && data.coverPosition !== 'center center') lines.push(`coverPosition: "${data.coverPosition}"`)
  if (data.metaTitle) lines.push(`metaTitle: "${data.metaTitle.replace(/"/g, '\\"')}"`)
  if (data.metaDescription) lines.push(`metaDescription: "${data.metaDescription.replace(/"/g, '\\"')}"`)
  if (data.tags && data.tags.length) lines.push(`tags: [${data.tags.map(t => `"${t}"`).join(', ')}]`)
  if (data.scheduledAt) lines.push(`scheduledAt: "${data.scheduledAt}"`)
  lines.push('---')
  return lines.join('\n')
}

export async function listPosts() {
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path: 'posts', ref: branch })
    const files = data.filter(f => f.name.endsWith('.md'))
    const posts = await Promise.all(files.map(async (file) => {
      const { data: fileData } = await octokit.repos.getContent({
        owner, repo, path: file.path, ref: branch
      })
      const content = Buffer.from(fileData.content, 'base64').toString('utf8')
      const matter = parseFrontmatter(content)
      return {
        id: file.name.replace('.md', ''),
        sha: fileData.sha,
        path: file.path,
        ...matter.data,
        bodyPreview: matter.body.slice(0, 120) + '...'
      }
    }))
    return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
  } catch (e) {
    console.error('listPosts error:', e)
    return []
  }
}

export async function getPost(filename) {
  const { data } = await octokit.repos.getContent({
    owner, repo, path: `posts/${filename}.md`, ref: branch
  })
  const content = Buffer.from(data.content, 'base64').toString('utf8')
  const matter = parseFrontmatter(content)
  return { sha: data.sha, ...matter.data, body: matter.body }
}

export async function savePost({ filename, frontmatter, body, sha }) {
  const content = buildFrontmatter(frontmatter) + '\n\n' + body
  const encoded = Buffer.from(content).toString('base64')
  const path = `posts/${filename}.md`
  await octokit.repos.createOrUpdateFileContents({
    owner, repo, path, branch,
    message: sha
      ? `\u270F\uFE0F Atualiza post: ${frontmatter.title}`
      : `\u2728 Novo post: ${frontmatter.title}`,
    content: encoded,
    ...(sha ? { sha } : {}),
  })
}

export async function deletePost({ path, sha, title }) {
  await octokit.repos.deleteFile({
    owner, repo, path, branch, sha,
    message: `\uD83D\uDDD1\uFE0F Remove post: ${title}`,
  })
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { data: {}, body: raw }
  const data = {}
  match[1].split('\n').forEach(line => {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) return
    const key = line.slice(0, colonIdx).trim()
    let value = line.slice(colonIdx + 1).trim()
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(v => v.trim().replace(/^"|"$/g, ''))
    }
    data[key] = value
  })
  return { data, body: match[2].trim() }
}
