import PostEditor from '../../../components/admin/PostEditor'

export default function EditarPost({ postData, sha }) {
  return <PostEditor initialData={postData} sha={sha} isEditing={true} />
}

export async function getServerSideProps(ctx) {
  const { getServerSession } = await import('next-auth/next')
  const { authOptions } = await import('../../api/auth/[...nextauth]')
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session) return { redirect: { destination: '/admin/login', permanent: false } }

  const { id } = ctx.params

  try {
    const { getPost } = await import('../../../lib/github')
    const post = await getPost(id)

    // Parse categories — support both old single category and new array
    let categories = []
    if (Array.isArray(post.categories)) {
      categories = post.categories
    } else if (typeof post.categories === 'string' && post.categories.trim()) {
      categories = post.categories.split(',').map(c => c.trim()).filter(Boolean)
    } else if (post.category) {
      categories = [post.category]
    }

    return {
      props: {
        postData: {
          title: post.title || '',
          date: post.date || '',
          categories: categories,
          category: post.category || '',
          author: post.author || '',
          excerpt: post.excerpt || '',
          slug: post.slug || id,
          status: post.status || 'published',
          coverImage: post.coverImage || '',
          coverPosition: post.coverPosition || 'center center',
          metaTitle: post.metaTitle || '',
          metaDescription: post.metaDescription || '',
          tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''),
          scheduledAt: post.scheduledAt || '',
          body: post.body || '',
        },
        sha: post.sha,
      }
    }
  } catch (e) {
    return { redirect: { destination: '/admin', permanent: false } }
  }
}
