import {
  ArticleStatus,
} from '@prisma/client'

import {
  buildArticleWhereClause,
  buildPagination,
  buildSortClause,
  type ArticleListQuery,
} from './article.queries'

import {
  archiveArticle,
  countArticles,
  listArticles,
} from './article.repository'

import {
  createDraft,
  deleteArticle,
  findArticleById,
  updateArticle,
} from './article.repository'

import { prisma } from '@/lib/db/prisma'

import {
  createArticleVersion,
} from '@/modules/versions/version.repository'

import {
  canArchiveArticle,
  canEditPublishedArticle,
  canPublishArticle,
} from './article.permissions'

import {
  canDeleteArticle,
  canEditDraft,
  canViewArticle,
} from './article.permissions'

import type {
  CreateDraftInput,
  UpdateDraftInput,
} from './article.types'

export async function createDraftArticle(
  creatorId: string,
  input: CreateDraftInput
) {
  return createDraft({
    ...input,
    creatorId,
  })
}

export async function getArticleById(
  articleId: string,
  user: {
    id: string
    role: string
  }
) {
  const article =
    await findArticleById(
      articleId
    )

  if (!article) {
    throw new Error(
      'Article not found'
    )
  }

  const canView =
    canViewArticle(
      user as never,
      article
    )

  if (!canView) {
    throw new Error(
      'You do not have access to this article'
    )
  }

  return article
}

export async function updateDraftArticle(
  articleId: string,
  user: {
    id: string
    role: string
  },
  input: UpdateDraftInput
) {
  const article =
    await findArticleById(
      articleId
    )

  if (!article) {
    throw new Error(
      'Article not found'
    )
  }
  if (
  article.currentVersion !==
  input.currentVersion
) {
  throw new Error(
    'This article was updated by another user. Please refresh and try again.'
  )
}

  if (
    article.status !==
    ArticleStatus.DRAFT
  ) {
    throw new Error(
      'Only draft articles can be edited here'
    )
  }

  

  const canEdit =
    canEditDraft(
      user as never,
      article
    )

  if (!canEdit) {
    throw new Error(
      'You cannot edit this article'
    )
  }

  return updateArticle(
    articleId,
    input
  )
}

export async function deleteDraftArticle(
  articleId: string,
  user: {
    id: string
    role: string
  }
) {
  const article =
    await findArticleById(
      articleId
    )

  if (!article) {
    throw new Error(
      'Article not found'
    )
  }

  const canDelete =
    canDeleteArticle(
      user as never,
      article
    )

  if (!canDelete) {
    throw new Error(
      'You cannot delete this article'
    )
  }

  return deleteArticle(articleId)
}

export async function publishArticle(
  articleId: string,
  user: {
    id: string
    role: string
  }
) {
  const article =
    await findArticleById(
      articleId
    )

  if (!article) {
    throw new Error(
      'Article not found'
    )
  }

  const canPublish =
    canPublishArticle(
      user as never,
      article
    )

  if (!canPublish) {
    throw new Error(
      'You cannot publish this article'
    )
  }

  return prisma.$transaction(
    async (tx) => {
      const versionNumber = 1

      await tx.articleVersion.create({
        data: {
          articleId:
            article.id,

          versionNumber,

          titleSnapshot:
            article.title,

          bodySnapshot:
            article.body,

          editedById:
            user.id,
        },
      })

      return tx.article.update({
        where: {
          id: article.id,
        },

        data: {
          status:
            ArticleStatus.PUBLISHED,

          currentVersion:
            versionNumber,

          publishedAt:
            new Date(),
        },
      })
    }
  )
}

export async function updatePublishedArticle(
  articleId: string,
  user: {
    id: string
    role: string
  },
  input: UpdateDraftInput
) {
  const article =
    await findArticleById(
      articleId
    )

  if (!article) {
    throw new Error(
      'Article not found'
    )
  }

  if (
  article.currentVersion !==
  input.currentVersion
) {
  throw new Error(
    'This article was updated by another user. Please refresh and try again.'
  )
}

  const canEdit =
    canEditPublishedArticle(
      user as never,
      article
    )

  if (!canEdit) {
    throw new Error(
      'You cannot edit this article'
    )
  }

  return prisma.$transaction(
    async (tx) => {
      const nextVersion =
        article.currentVersion +
        1

      await tx.articleVersion.create({
        data: {
          articleId:
            article.id,

          versionNumber:
            nextVersion,

          titleSnapshot:
            input.title,

          bodySnapshot:
            input.body,

          editedById:
            user.id,
        },
      })

      return tx.article.update({
        where: {
          id: article.id,
        },

        data: {
          title:
            input.title,

          body:
            input.body,

          category:
            input.category,

          currentVersion:
            nextVersion,
        },
      })
    }
  )
}


export async function listPublishedArticles(
  query: ArticleListQuery
) {
  const where =
    buildArticleWhereClause({
      ...query,

      status:
        ArticleStatus.PUBLISHED,
    })

  const orderBy =
    buildSortClause(query)

  const pagination =
    buildPagination(query)

  const [
    articles,
    totalCount,
  ] = await Promise.all([
    listArticles({
      where,
      orderBy,
      ...pagination,
    }),

    countArticles(where),
  ])

  return {
    articles,

    pagination: {
      page:
        query.page ?? 1,

      pageSize:
        query.pageSize ??
        10,

      totalCount,

      totalPages:
        Math.ceil(
          totalCount /
            (query.pageSize ??
              10)
        ),
    },
  }
}

export async function archivePublishedArticle(
  articleId: string,
  user: {
    id: string
    role: string
  }
) {
  const article =
    await findArticleById(
      articleId
    )

  if (!article) {
    throw new Error(
      'Article not found'
    )
  }

  const canArchive =
    canArchiveArticle(
      user as never
    )

  if (!canArchive) {
    throw new Error(
      'You cannot archive articles'
    )
  }

  return archiveArticle(
    articleId
  )
}

export async function listArchivedArticles(
  query: ArticleListQuery
) {
  const where =
    buildArticleWhereClause({
      ...query,

      status:
        ArticleStatus.ARCHIVED,
    })

  const orderBy =
    buildSortClause(query)

  const pagination =
    buildPagination(query)

  const [
    articles,
    totalCount,
  ] = await Promise.all([
    listArticles({
      where,
      orderBy,
      ...pagination,
    }),

    countArticles(where),
  ])

  return {
    articles,

    pagination: {
      page:
        query.page ?? 1,

      pageSize:
        query.pageSize ??
        10,

      totalCount,

      totalPages:
        Math.ceil(
          totalCount /
            (query.pageSize ??
              10)
        ),
    },
  }
}