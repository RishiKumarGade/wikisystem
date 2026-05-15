import type {
  Article,
  User,
} from '@prisma/client'

export function canViewArticle(
  user: User,
  article: Article
) {
  if (
    article.status ===
    'PUBLISHED'
  ) {
    return true
  }

  if (
    article.status ===
      'DRAFT' &&
    article.creatorId === user.id
  ) {
    return true
  }

  if (
    article.status ===
    'ARCHIVED'
  ) {
    return true
  }

  return false
}

export function canEditDraft(
  user: User,
  article: Article
) {
  return (
    article.status ===
      'DRAFT' &&
    article.creatorId === user.id
  )
}

export function canDeleteArticle(
  user: User,
  article: Article
) {
  if (
    user.role === 'EDITOR'
  ) {
    return true
  }

  return (
    article.status ===
      'DRAFT' &&
    article.creatorId === user.id
  )
}


export function canEditPublishedArticle(
  user: User,
  article: Article
) {
  return (
    article.status ===
    'PUBLISHED'
  )
}

export function canPublishArticle(
  user: User,
  article: Article
) {
  return (
    article.status ===
      'DRAFT' &&
    article.creatorId === user.id
  )
}



export function canArchiveArticle(
  user: User
) {
  return (
    user.role === 'EDITOR'
  )
}