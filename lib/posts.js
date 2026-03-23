import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import { unified } from 'unified'
import remarkParse from 'remark-parse'

const postsDirectory = path.join(process.cwd(), 'posts')

function calculateReadingTime(content) {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return minutes
}

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter(name => name.endsWith('.md'))
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)
      const readingTime = calculateReadingTime(matterResult.content)
      return {
        id,
        readingTime,
        ...matterResult.data,
      }
    })
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) return 1
    else return -1
  })
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter(name => name.endsWith('.md'))
    .map((fileName) => ({
      params: { id: fileName.replace(/\.md$/, '') },
    }))
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)

  let contentHtml = ''
  try {
    // Use unified pipeline with rehype-raw to support inline HTML (buttons, etc.)
    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(matterResult.content)
    contentHtml = processedContent.toString()
  } catch (e) {
    // Fallback to basic remark-html if rehype plugins not available
    const processedContent = await remark()
      .use(html, { sanitize: false, allowDangerousHtml: true })
      .process(matterResult.content)
    contentHtml = processedContent.toString()
  }

  const readingTime = calculateReadingTime(matterResult.content)
  return {
    id,
    contentHtml,
    readingTime,
    ...matterResult.data,
  }
}
