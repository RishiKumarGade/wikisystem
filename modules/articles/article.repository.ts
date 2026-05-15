import { prisma } from '@/lib/db/prisma'

import {
  ArticleCategory,
  ArticleStatus,
} from '@prisma/client'

export async function createDraft(
  data: {
    title: string
    body: string
    category: ArticleCategory
    creatorId: string
  }
) {
  return prisma.article.create({
    data: {
      ...data,
      status:
        ArticleStatus.DRAFT,
    },
  })
}

export async function findArticleById(
  id: string
) {
  return prisma.article.findUnique({
    where: {
      id,
    },
  })
}

export async function updateArticle(
  id: string,
  data: {
    title: string
    body: string
    category: ArticleCategory
  }
) {
  return prisma.article.update({
    where: {
      id,
    },
    data,
  })
}

export async function deleteArticle(
  id: string
) {
  return prisma.article.delete({
    where: {
      id,
    },
  })
}