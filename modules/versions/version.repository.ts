import { prisma } from '@/lib/db/prisma'

export async function createArticleVersion(
  data: {
    articleId: string
    versionNumber: number

    titleSnapshot: string
    bodySnapshot: string

    editedById: string

    editSummary?: string
  }
) {
  return prisma.articleVersion.create({
    data,
  })
}

export async function getArticleVersions(
  articleId: string
) {
  return prisma.articleVersion.findMany({
    where: {
      articleId,
    },

    orderBy: {
      versionNumber: 'desc',
    },

    include: {
      editedBy: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  })
}

export async function getArticleVersion(
  articleId: string,
  versionNumber: number
) {
  return prisma.articleVersion.findUnique({
    where: {
      articleId_versionNumber: {
        articleId,
        versionNumber,
      },
    },

    include: {
      editedBy: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  })
}

