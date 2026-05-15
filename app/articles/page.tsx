import Link from 'next/link'
import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/auth/current-user'

import {
  listPublishedArticles,
} from '@/modules/articles/article.service'

import { ArticleCategory } from '@prisma/client'

import { ArticleCard } from '@/components/article/article-card'

import { PaginationControls } from '@/components/article/pagination-controls'

import { ArticleSearchControls } from '@/components/article/article-search-controls'

type SearchParams = Promise<{
  search?: string
  category?: string
  page?: string
}>

type Props = {
  searchParams: SearchParams
}

export default async function ArticlesPage({
  searchParams,
}: Props) {
  const user =
    await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const resolvedSearchParams =
    await searchParams

  const page = Number(
    resolvedSearchParams.page ??
      '1'
  )

  const data =
    await listPublishedArticles(
      {
        search:
          resolvedSearchParams.search,

        category:
          resolvedSearchParams.category as ArticleCategory,

        page,
      }
    )

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            WikiSystem
          </h1>

          <p className="mt-2 text-gray-600">
            Welcome back, {user.email}
          </p>
        </div>

        <Link
          href="/articles/new"
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          New Draft
        </Link>
      </div>

      <ArticleSearchControls />

      {data.articles.length ===
      0 ? (
        <div className="rounded-xl border bg-white p-8 text-center text-gray-600">
          No articles found.
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

      <PaginationControls
        page={
          data.pagination.page
        }
        totalPages={
          data.pagination
            .totalPages
        }
        searchParams={
          resolvedSearchParams
        }
      />
    </main>
  )
}