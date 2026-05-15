import { z } from 'zod'

import {
  ArticleCategory,
} from '@prisma/client'

export const createDraftSchema =
  z.object({
    title: z
      .string()
      .trim()
      .min(1, 'Title is required'),

    body: z
      .string()
      .trim()
      .min(1, 'Body is required'),

    category: z.enum(
      ArticleCategory
    ),
  })

export const updateDraftSchema =
  createDraftSchema.extend({
    currentVersion:
      z.number().int().min(1),
  })