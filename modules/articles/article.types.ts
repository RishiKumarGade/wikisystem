import type {
  ArticleCategory,
} from '@prisma/client'

export type CreateDraftInput = {
  title: string
  body: string
  category: ArticleCategory
}

export type UpdateDraftInput = {
  title: string
  body: string
  category: ArticleCategory

  currentVersion: number
}