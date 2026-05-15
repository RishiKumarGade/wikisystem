import {
  ArticleCategory,
  ArticleStatus,
  Prisma,
} from '@prisma/client'

export type ArticleListQuery = {
  search?: string

  category?: ArticleCategory

  status?: ArticleStatus

  sortBy?:
    | 'updatedAt'
    | 'createdAt'
    | 'title'

  sortOrder?: 'asc' | 'desc'

  page?: number
  pageSize?: number
}

export function buildArticleWhereClause(
  query: ArticleListQuery
): Prisma.ArticleWhereInput {
  return {
    ...(query.status && {
      status: query.status,
    }),

    ...(query.category && {
      category:
        query.category,
    }),

    ...(query.search && {
      OR: [
        {
          title: {
            contains:
              query.search,
          },
        },

        {
          body: {
            contains:
              query.search,
          },
        },
      ],
    }),
  }
}

export function buildSortClause(
  query: ArticleListQuery
): Prisma.ArticleOrderByWithRelationInput {
  return {
    [
      query.sortBy ??
        'updatedAt'
    ]:
      query.sortOrder ??
      'desc',
  }
}

export function buildPagination(
  query: ArticleListQuery
) {
  const page =
    query.page ?? 1

  const pageSize =
    query.pageSize ?? 10

  return {
    skip:
      (page - 1) *
      pageSize,

    take: pageSize,
  }
}