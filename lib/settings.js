import { Octokit } from '@octokit/rest'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
const owner = process.env.GITHUB_OWNER
const repo = process.env.GITHUB_REPO
const branch = process.env.GITHUB_BRANCH || 'main'

const defaultSettings = {
  storeUrl: 'https://www.editoraecclesiae.com.br',
  instagram: '',
  facebook: '',
  youtube: '',
  twitter: '',
  tiktok: '',
  email: 'contato@editoraecclesiae.com.br',
}

export async function getSettings() {
  try {
    const { data } = await octokit.repos.getContent({
      owner, repo, path: 'config/settings.json', ref: branch
    })
    const content = Buffer.from(data.content, 'base64').toString('utf8')
    const parsed = JSON.parse(content)
    return { ...defaultSettings, ...parsed }
  } catch (e) {
    return defaultSettings
  }
}
