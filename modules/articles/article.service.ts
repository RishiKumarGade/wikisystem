import {
  ArticleStatus,
} from '@prisma/client'

import {
  createDraft,
  deleteArticle,
  findArticleById,
  updateArticle,
} from './article.repository'

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