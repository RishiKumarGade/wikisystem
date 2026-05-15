import { prisma } from '@/lib/db/prisma'

import {
  ArticleCategory,
  ArticleStatus,
  Prisma,
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

export async function listArticles(
  args: {
    where?: Prisma.ArticleWhereInput

    orderBy?: Prisma.ArticleOrderByWithRelationInput

    skip?: number
    take?: number
  }
) {
  return prisma.article.findMany({
    where: args.where,

    orderBy:
      args.orderBy,

    skip: args.skip,

    take: args.take,
  })
}

export async function countArticles(
  where?: Prisma.ArticleWhereInput
) {
  return prisma.article.count({
    where,
  })
}

export async function archiveArticle(
  id: string
) {
  return prisma.article.update({
    where: {
      id,
    },

    data: {
      status:
        ArticleStatus.ARCHIVED,
    },
  })
}