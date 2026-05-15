import Link from 'next/link'
import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/auth/current-user'

import {
  listArchivedArticles,
} from '@/modules/articles/article.service'

import { ArticleCard } from '@/components/article/article-card'

export default async function ArchivedArticlesPage() {
  const user =
    await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const data =
    await listArchivedArticles(
      {}
    )

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Archived Articles
          </h1>

          <p className="mt-2 text-gray-600">
            Historical archived knowledge entries.
          </p>
        </div>

        <Link
          href="/articles"
          className="rounded-lg border px-4 py-2"
        >
          Back To Articles
        </Link>
      </div>

      {data.articles.length ===
      0 ? (
        <div className="rounded-xl border bg-white p-8 text-center text-gray-600">
          No archived articles found.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {data.articles.map(
            (article) => (
              <ArticleCard
                key={
                  article.id
                }
                article={
                  article
                }
              />
            )
          )}
        </div>
      )}
    </main>
  )
}