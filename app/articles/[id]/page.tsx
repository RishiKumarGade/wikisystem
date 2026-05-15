import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/auth/current-user'

import {
  getArticleById,
} from '@/modules/articles/article.service'
import { PublishButton } from '@/components/article/publish-button'

type Params = {
  params: Promise<{
    id: string
  }>
}

export default async function ArticlePage({
  params,
}: Params) {
  const user =
    await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const { id } =
    await params

  let article

  try {
    article =
      await getArticleById(
        id,
        user
      )
  } catch {
    notFound()
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <span className="rounded-full border px-3 py-1 text-sm">
            {article.status}
          </span>

          <span className="rounded-full border px-3 py-1 text-sm">
            {article.category}
          </span>
        </div>

        <h1 className="text-4xl font-bold">
          {article.title}
        </h1>

        <p className="mt-3 text-sm text-gray-500">
          Last updated{' '}
          {new Date(
            article.updatedAt
          ).toLocaleString()}
        </p>
      </div>

      <article className="prose max-w-none whitespace-pre-wrap">
        {article.body}
      </article>

     <div className="mt-10 flex gap-3">
  <Link
    href={`/articles/${article.id}/edit`}
    className="rounded-lg border px-4 py-2"
  >
    {article.status ===
    'DRAFT'
      ? 'Edit Draft'
      : 'Edit Article'}
  </Link>

  {article.status ===
  'DRAFT' ? (
    <PublishButton
      articleId={article.id}
    />
  ) : null}

  <Link
    href={`/articles/${article.id}/history`}
    className="rounded-lg border px-4 py-2"
  >
    Version History
  </Link>
</div>
    </main>
  )
}