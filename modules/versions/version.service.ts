import {
  findArticleById,
} from '@/modules/articles/article.repository'

import {
  canViewArticle,
} from '@/modules/articles/article.permissions'

import {
  getArticleVersion,
  getArticleVersions,
} from './version.repository'

import {
  generateTextDiff,
} from './version.utils'

export async function getVersionHistory(
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

  return getArticleVersions(
    articleId
  )
}

export async function getVersionDetail(
  articleId: string,
  versionNumber: number,
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

  const version =
    await getArticleVersion(
      articleId,
      versionNumber
    )

  if (!version) {
    throw new Error(
      'Version not found'
    )
  }

  return version
}

export async function getVersionDiff(
  articleId: string,
  versionNumber: number,
  user: {
    id: string
    role: string
  }
) {
  const currentVersion =
    await getVersionDetail(
      articleId,
      versionNumber,
      user
    )

  const previousVersion =
    versionNumber > 1
      ? await getArticleVersion(
          articleId,
          versionNumber - 1
        )
      : null

  return {
    version:
      currentVersion,

    diff:
      generateTextDiff(
        previousVersion?.bodySnapshot ??
          '',
        currentVersion.bodySnapshot
      ),
  }
}