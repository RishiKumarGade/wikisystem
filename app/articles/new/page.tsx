import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/auth/current-user'

import { ArticleForm } from '@/components/article/article-form'

export default async function NewArticlePage() {
  const user =
    await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Create Draft
        </h1>

        <p className="mt-2 text-gray-600">
          Start writing a new knowledge-base article.
        </p>
      </div>

      <ArticleForm mode="create" />
    </main>
  )
}