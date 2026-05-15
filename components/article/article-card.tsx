import Link from 'next/link'

import type {
  Article,
} from '@prisma/client'

type ArticleCardProps = {
  article: Article
}

export function ArticleCard({
  article,
}: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${article.id}`}
      className="block rounded-xl border bg-white p-5 transition hover:shadow-sm"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-full border px-2 py-1 text-xs">
          {article.category}
        </span>

        <span className="rounded-full border px-2 py-1 text-xs">
          v{article.currentVersion}
        </span>
      </div>

      <h2 className="text-xl font-semibold">
        {article.title}
      </h2>

      <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-sm text-gray-600">
        {article.body}
      </p>

      <p className="mt-4 text-xs text-gray-500">
        Updated{' '}
        {new Date(
          article.updatedAt
        ).toLocaleString()}
      </p>
    </Link>
  )
}