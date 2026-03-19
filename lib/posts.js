import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

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
  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(matterResult.content)
  const contentHtml = processedContent.toString()
  const readingTime = calculateReadingTime(matterResult.content)
  return {
    id,
    contentHtml,
    readingTime,
    ...matterResult.data,
  }
}
