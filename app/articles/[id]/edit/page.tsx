import { notFound, redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/auth/current-user'

import {
  getArticleById,
} from '@/modules/articles/article.service'

import { ArticleForm } from '@/components/article/article-form'

type Params = {
  params: Promise<{
    id: string
  }>
}

export default async function EditArticlePage({
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
        <h1 className="text-3xl font-bold">
          Edit Draft
        </h1>

        <p className="mt-2 text-gray-600">
          Update your article draft.
        </p>
      </div>

      <ArticleForm
        mode="edit"
        articleId={article.id}
        initialValues={{
          title:
            article.title,

          body:
            article.body,

          category:
            article.category,
        }}
      />
    </main>
  )
}